import { auth } from '@clerk/nextjs/server';
import { files } from '@/lib/db/schema';
import { db } from '@/lib/db';
import { eq, isNull, and } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json('Unauthorized', { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const queryUserId = searchParams.get("userId");
    const parentId = searchParams.get("parentId");

    if (!queryUserId || queryUserId !== userId) {
      return NextResponse.json('Bad Request', { status: 400 });
    }

    //fetch files from the db
    let userFiles;

    if (parentId) {
      //fetch from a specific folder
      userFiles = await db
        .select()
        .from(files)
        .where(and(eq(files.userId, userId), eq(files.parentId, parentId)));
    } else {
      //fetch from root folder
      userFiles = await db
        .select()
        .from(files)
        .where(and(eq(files.userId, userId), isNull(files.parentId)));
    }

    return NextResponse.json(userFiles);
  } catch (err) {
    console.error('Error fetching files:', err);
    return NextResponse.json('Internal Server Error', { status: 500 });
  }
}
