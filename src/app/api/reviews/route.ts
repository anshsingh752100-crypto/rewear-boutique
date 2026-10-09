import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const all = searchParams.get('all') === 'true';

    const user = await getCurrentUser();

    const where: any = {};
    if (productId) {
      where.productId = productId;
    }

    if (!all || !user || user.role !== 'ADMIN') {
      where.isApproved = true;
    }

    const reviews = await prisma.review.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        product: {
          select: { name: true, images: true },
        },
      },
    });

    const formatted = reviews.map((r) => ({
      ...r,
      productName: r.product?.name,
      productImage: r.product?.images ? JSON.parse(r.product.images)[0] : null,
    }));

    return NextResponse.json({ reviews: formatted });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();
    const { productId, rating, title, comment, userName } = body;

    if (!productId || !rating || !comment) {
      return NextResponse.json(
        { error: 'Product, rating, and review text are required' },
        { status: 400 }
      );
    }

    const review = await prisma.review.create({
      data: {
        productId,
        userId: user ? user.id : null,
        userName: userName?.trim() || user?.name || 'Anonymous Connoisseur',
        rating: Math.min(5, Math.max(1, parseInt(rating, 10))),
        title: title?.trim() || null,
        comment: comment.trim(),
        isApproved: true, // auto-approve with moderation capability in admin
      },
    });

    // Update product rating and reviews count
    const productReviews = await prisma.review.findMany({
      where: { productId, isApproved: true },
      select: { rating: true },
    });

    const totalRating = productReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = totalRating / (productReviews.length || 1);

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: parseFloat(avgRating.toFixed(1)),
        reviewsCount: productReviews.length,
      },
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error('Error submitting review:', error);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id, isApproved } = await request.json();

    const review = await prisma.review.update({
      where: { id },
      data: { isApproved },
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error('Error updating review status:', error);
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });
    }

    await prisma.review.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}
