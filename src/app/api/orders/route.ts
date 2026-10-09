import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { generateOrderNumber } from '@/lib/utils';

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    if (!user) {
      return NextResponse.json({ error: 'Please sign in to view orders' }, { status: 401 });
    }

    const where: any = {};

    if (user.role === 'ADMIN') {
      if (status && status !== 'ALL') {
        where.status = status;
      }
    } else {
      where.userId = user.id;
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
        user: {
          select: { name: true, email: true },
        },
      },
    });

    const formattedOrders = orders.map((o) => ({
      ...o,
      shippingAddress: JSON.parse(o.shippingAddress),
      billingAddress: o.billingAddress ? JSON.parse(o.billingAddress) : null,
    }));

    return NextResponse.json({ orders: formattedOrders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();

    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      paymentMethod,
      items,
      couponCode,
    } = body;

    if (!customerName || !customerEmail || !shippingAddress || !items || !items.length) {
      return NextResponse.json(
        { error: 'Missing required order details' },
        { status: 400 }
      );
    }

    // Calculate subtotal
    let subtotal = 0;
    for (const item of items) {
      subtotal += item.price * item.quantity;
    }

    // Calculate coupon discount
    let discountAmount = 0;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase().trim() },
      });

      if (coupon && coupon.isActive) {
        if (subtotal >= coupon.minOrderValue) {
          if (coupon.discountType === 'PERCENT') {
            discountAmount = (subtotal * coupon.discountValue) / 100;
            if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
              discountAmount = coupon.maxDiscount;
            }
          } else {
            discountAmount = Math.min(coupon.discountValue, subtotal);
          }

          // Increment coupon usage
          await prisma.coupon.update({
            where: { id: coupon.id },
            data: { timesUsed: { increment: 1 } },
          });
        }
      }
    }

    const shippingFee = subtotal >= 5000 ? 0 : 150;
    const taxableSubtotal = Math.max(0, subtotal - discountAmount);
    const tax = taxableSubtotal * 0.085;
    const total = taxableSubtotal + shippingFee + tax;

    const orderNumber = generateOrderNumber();
    const estimatedDelivery = new Date(Date.now() + 86400000 * 5); // 5 days estimated delivery

    const paymentStatus = paymentMethod === 'CARD' ? 'PAID' : 'PENDING';

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: user ? user.id : null,
        customerName: customerName.trim(),
        customerEmail: customerEmail.toLowerCase().trim(),
        customerPhone: customerPhone?.trim() || null,
        shippingAddress: JSON.stringify(shippingAddress),
        paymentMethod: paymentMethod === 'CARD' ? 'CARD' : 'COD',
        paymentStatus,
        status: 'PROCESSING',
        subtotal,
        tax,
        shippingFee,
        discountAmount,
        total,
        couponCode: couponCode || null,
        estimatedDelivery,
        items: {
          create: items.map((i: any) => ({
            productId: i.productId || null,
            productName: i.name,
            productImage: i.image || null,
            price: i.price,
            quantity: i.quantity,
            variant: i.selectedVariant || null,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Update stock levels
    for (const item of items) {
      if (item.productId) {
        try {
          await prisma.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        } catch (stockError) {
          console.warn('Could not decrement stock for product', item.productId);
        }
      }
    }

    return NextResponse.json({
      success: true,
      order: {
        ...order,
        shippingAddress: JSON.parse(order.shippingAddress),
      },
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to process order' },
      { status: 500 }
    );
  }
}
