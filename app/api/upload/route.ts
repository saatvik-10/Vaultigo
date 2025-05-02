import { db } from '@/lib/db';
import { files } from '@/lib/db/schema';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    //parse the request body
    const body = await req.json();
    const { imagekit, userId: bodyUserId } = body;

    if (bodyUserId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!imagekit || !imagekit.url) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const fileData = {
      name: imagekit.name || 'untitled',
      path: imagekit.filePath || `/vaultigo/${userId}/${imagekit.name}`,
      size: imagekit.size || 0,
      type: imagekit.type || 'image',
      fileUrl: imagekit.url,
      thumbnailUrl: imagekit.thumbnailUrl || null,
      userId: userId,
      parentId: null, // root lvl by default
      isFolder: false,
      isStarred: false,
      isTrashed: false,
    };

    const [newFile] = await db.insert(files).values(fileData).returning();

    return NextResponse.json(newFile, { status: 200 });
  } catch (err) {
    console.error('Error saving file:', err);
    return NextResponse.json(
      { error: 'Failed to save file information into the database' },
      { status: 500 }
    );
  }
}
