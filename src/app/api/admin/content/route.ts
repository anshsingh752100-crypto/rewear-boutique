import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { DEFAULT_HERO_SLIDES, DEFAULT_BRAND_STORY, DEFAULT_STORE_SETTINGS } from '@/lib/constants';

export async function GET() {
  try {
    const contents = await prisma.siteContent.findMany();
    const contentMap: Record<string, any> = {};

    contents.forEach((item) => {
      try {
        contentMap[item.key] = JSON.parse(item.value);
      } catch {
        contentMap[item.key] = item.value;
      }
    });

    return NextResponse.json({
      heroSlides: contentMap.heroSlides || DEFAULT_HERO_SLIDES,
      brandStory: contentMap.brandStory || DEFAULT_BRAND_STORY,
      storeSettings: contentMap.storeSettings || DEFAULT_STORE_SETTINGS,
    });
  } catch (error) {
    console.error('Error fetching CMS content:', error);
    return NextResponse.json({
      heroSlides: DEFAULT_HERO_SLIDES,
      brandStory: DEFAULT_BRAND_STORY,
      storeSettings: DEFAULT_STORE_SETTINGS,
    });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { key, value } = body;

    if (!key || value === undefined) {
      return NextResponse.json({ error: 'Key and value are required' }, { status: 400 });
    }

    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);

    await prisma.siteContent.upsert({
      where: { key },
      update: { value: stringValue },
      create: { key, value: stringValue },
    });

    return NextResponse.json({ success: true, message: 'Content saved successfully' });
  } catch (error) {
    console.error('Error updating CMS content:', error);
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}
