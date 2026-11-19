import { NextRequest, NextResponse } from 'next/server';
import { Doc } from '@/lib/models';
import { notFound, readJson, route } from '@/lib/route';

export const dynamic = 'force-dynamic';

export const POST = route<{ id: string }>(async (req: NextRequest, { id }) => {
  const body = await readJson(req);
  const doc = await Doc.findByIdAndUpdate(
    id,
    { $push: { tabs: { title: typeof body.title === 'string' && body.title ? body.title : 'New tab', content: typeof body.content === 'string' ? body.content : '' } } },
    { new: true }
  );
  if (!doc) return notFound();
  return NextResponse.json(doc.tabs[doc.tabs.length - 1], { status: 201 });
});
