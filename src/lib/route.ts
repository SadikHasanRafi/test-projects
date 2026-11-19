import { NextRequest, NextResponse } from 'next/server';
import { isValidObjectId } from 'mongoose';
import { connect } from './mongodb';

type Params = Record<string, string>;
export type Ctx<P extends Params = Params> = { params: Promise<P> };

export const notFound = () => NextResponse.json({ error: 'Not found' }, { status: 404 });

/** Connects to MongoDB, validates ObjectId params, and turns thrown errors into JSON 500s. */
export function route<P extends Params>(fn: (req: NextRequest, params: P) => Promise<Response>) {
  return async (req: NextRequest, ctx: Ctx<P>) => {
    try {
      // routes without dynamic segments receive no params at runtime
      const params = ((await ctx.params) ?? {}) as P;
      if (Object.values(params).some((v) => !isValidObjectId(v))) return notFound();
      await connect();
      return await fn(req, params);
    } catch (e) {
      console.error(e);
      return NextResponse.json({ error: (e as Error).message }, { status: 500 });
    }
  };
}

export const readJson = async (req: NextRequest) => (await req.json().catch(() => ({}))) as Record<string, unknown>;
