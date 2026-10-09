import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ wishlist: [] });
    }

    const items = await prisma.wishlistItem.findMany({
      where: { userId: session.id },
      include: {
        product: {
          include: {
            category: {
              select: { name: true, slug: true },
            },
          },
        },
      },
    });

    const products = items.map((i) => ({
      ...i.product,
      images: JSON.parse(i.product.images),
      variants: i.product.variants ? JSON.parse(i.product.variants) : null,
    }));

    return NextResponse.json({ wishlist: products });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: 'Please sign in to save items' }, { status: 401 });
    }

    const { productId } = await request.json();
    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const existing = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: session.id,
          productId,
        },
      },
    });

    if (existing) {
      await prisma.wishlistItem.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ saved: false, message: 'Removed from personal collection' });
    } else {
      await prisma.wishlistItem.create({
        data: {
          userId: session.id,
          productId,
        },
      });
      return NextResponse.json({ saved: true, message: 'Added to your private wishlist' });
    }
  } catch (error) {
    console.error('Error toggling wishlist:', error);
    return NextResponse.json({ error: 'Failed to update wishlist' }, { status: 500 });
  }
}
