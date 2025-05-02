import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { files } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { name, parentId = null, userId: bodyUserId } = body;

    if (bodyUserId !== userId) {
      return NextResponse.json('Unauthorized', { status: 401 });
    }

    if (!name || typeof name! == 'string' || name.trim() === '') {
      return NextResponse.json('Folder name is required', { status: 400 });
    }

    if (parentId) {
      const [parentFolder] = await db
        .select()
        .from(files)
        .where(
          and(
            //all the statments inside must be true
            eq(files.id, parentId),
            eq(files.userId, userId),
            eq(files.isFolder, true)
          )
        );
      if (!parentFolder) {
        return NextResponse.json('Parent folder not found', { status: 404 });
      }
    }

    //create folder in database
    const folderData = {
      id: uuidv4(),
      name: name.trim(),
      path: `/folder/${userId}/${uuidv4()}`,
      size: 0,
      type: 'folder',
      fileUrl: '',
      thumbnailUrl: '',
      userId,
      parentId,
      isFolder: true,
      isStarred: false,
      isTrash: false,
    };

    const [newFolder] = await db.insert(files).values(folderData).returning();

    return NextResponse.json({
      success: true,
      message: 'Folder created successfully',
      folder: newFolder,
    });
  } catch (err) {
    console.error('Error creating folder:', err);
    return NextResponse.json(
      { success: false, message: 'Error creating folder' },
      { status: 500 }
    );
  }
}
