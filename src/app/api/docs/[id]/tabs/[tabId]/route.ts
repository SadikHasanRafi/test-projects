import { NextRequest, NextResponse } from 'next/server';
import { Doc } from '@/lib/models';
import { notFound, readJson, route } from '@/lib/route';

export const dynamic = 'force-dynamic';
type P = { id: string; tabId: string };

export const PATCH = route<P>(async (req: NextRequest, { id, tabId }) => {
  const body = await readJson(req);
  const $set: Record<string, string> = {};
  if (typeof body.title === 'string') $set['tabs.$.title'] = body.title.slice(0, 200);
  if (typeof body.content === 'string') $set['tabs.$.content'] = body.content;
  const r = await Doc.updateOne({ _id: id, 'tabs._id': tabId }, { $set });
  return r.matchedCount ? NextResponse.json({ ok: true, updatedAt: new Date() }) : notFound();
});

export const DELETE = route<P>(async (_req, { id, tabId }) => {
  const doc = await Doc.findById(id).select('tabs._id').lean();
  if (!doc) return notFound();
  if (doc.tabs.length <= 1) return NextResponse.json({ error: 'A document needs at least one tab' }, { status: 400 });
  await Doc.updateOne({ _id: id }, { $pull: { tabs: { _id: tabId } } });
  return new NextResponse(null, { status: 204 });
});
