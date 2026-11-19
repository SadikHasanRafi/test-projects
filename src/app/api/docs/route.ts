import { NextRequest, NextResponse } from 'next/server';
import { Doc } from '@/lib/models';
import { readJson, route } from '@/lib/route';

export const dynamic = 'force-dynamic';

const strip = (html = '') =>
  html.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim().slice(0, 220);

// List documents (lightweight: title + preview of the first tab)
export const GET = route(async () => {
  const rows = await Doc.aggregate([
    { $sort: { updatedAt: -1 } },
    {
      $project: {
        title: 1, updatedAt: 1, createdAt: 1,
        tabCount: { $size: '$tabs' },
        preview: { $substrCP: [{ $ifNull: [{ $arrayElemAt: ['$tabs.content', 0] }, ''] }, 0, 2500] },
      },
    },
  ]);
  return NextResponse.json(rows.map((r) => ({ ...r, preview: strip(r.preview) })));
});

export const POST = route(async (req: NextRequest) => {
  const body = await readJson(req);
  const doc = await Doc.create({ title: typeof body.title === 'string' && body.title ? body.title : 'Untitled document' });
  return NextResponse.json(doc, { status: 201 });
});
