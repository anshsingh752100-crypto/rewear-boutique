import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        category: true,
        reviews: {
          where: { isApproved: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Also get related products in the same category
    const related = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
      },
      take: 4,
      include: {
        category: {
          select: { name: true, slug: true },
        },
      },
    });

    return NextResponse.json({
      product: {
        ...product,
        images: JSON.parse(product.images || '[]'),
        variants: product.variants ? JSON.parse(product.variants) : null,
      },
      related: related.map((r) => ({
        ...r,
        images: JSON.parse(r.images || '[]'),
        variants: r.variants ? JSON.parse(r.variants) : null,
      })),
    });
  } catch (error) {
    console.error('Error fetching product detail:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = params;
    const body = await request.json();

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name: body.name !== undefined ? body.name : existing.name,
        slug: body.slug !== undefined ? body.slug : existing.slug,
        description: body.description !== undefined ? body.description : existing.description,
        craftsmanship: body.craftsmanship !== undefined ? body.craftsmanship : existing.craftsmanship,
        materials: body.materials !== undefined ? body.materials : existing.materials,
        origin: body.origin !== undefined ? body.origin : existing.origin,
        careInstructions: body.careInstructions !== undefined ? body.careInstructions : existing.careInstructions,
        price: body.price !== undefined ? parseFloat(body.price) : existing.price,
        originalPrice: body.originalPrice !== undefined ? (body.originalPrice ? parseFloat(body.originalPrice) : null) : existing.originalPrice,
        stock: body.stock !== undefined ? parseInt(body.stock, 10) : existing.stock,
        isFeatured: body.isFeatured !== undefined ? !!body.isFeatured : existing.isFeatured,
        isNewArrival: body.isNewArrival !== undefined ? !!body.isNewArrival : existing.isNewArrival,
        categoryId: body.categoryId !== undefined ? body.categoryId : existing.categoryId,
        images: body.images !== undefined ? JSON.stringify(Array.isArray(body.images) ? body.images : [body.images]) : existing.images,
        variants: body.variants !== undefined ? (typeof body.variants === 'string' ? body.variants : JSON.stringify(body.variants)) : existing.variants,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({
      success: true,
      product: {
        ...updated,
        images: JSON.parse(updated.images),
        variants: updated.variants ? JSON.parse(updated.variants) : null,
      },
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = params;
    await prisma.product.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: 'Product removed from collection',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
