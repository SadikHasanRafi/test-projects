import { NextRequest, NextResponse } from 'next/server';
import { Doc } from '@/lib/models';
import { notFound, readJson, route } from '@/lib/route';

export const dynamic = 'force-dynamic';
type P = { id: string };

export const GET = route<P>(async (_req, { id }) => {
  const doc = await Doc.findById(id).lean();
  return doc ? NextResponse.json(doc) : notFound();
});

export const PATCH = route<P>(async (req: NextRequest, { id }) => {
  const body = await readJson(req);
  const doc = await Doc.findByIdAndUpdate(id, { title: String(body.title ?? '').slice(0, 300) }, { new: true });
  return doc ? NextResponse.json({ _id: doc._id, title: doc.title, updatedAt: doc.updatedAt }) : notFound();
});

export const DELETE = route<P>(async (_req, { id }) => {
  await Doc.findByIdAndDelete(id);
  return new NextResponse(null, { status: 204 });
});
