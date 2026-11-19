import { NextResponse } from 'next/server';
import { Doc } from '@/lib/models';
import { notFound, route } from '@/lib/route';

export const dynamic = 'force-dynamic';

export const POST = route<{ id: string }>(async (_req, { id }) => {
  const src = await Doc.findById(id).lean();
  if (!src) return notFound();
  const copy = await Doc.create({
    title: `Copy of ${src.title}`,
    tabs: src.tabs.map((t) => ({ title: t.title, content: t.content })),
  });
  return NextResponse.json(copy, { status: 201 });
});
