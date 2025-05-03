import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { files } from '@/lib/db/schema';
import { NextRequest, NextResponse } from 'next/server';
import { eq, and } from 'drizzle-orm';
import ImageKit from 'imagekit';
import { v4 as uuidv4 } from 'uuid';

var imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT!,
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const formUserId = formData.get('userId') as string;
    const parentId = (formData.get('parentId') as string) || null;

    if (formUserId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (parentId) {
      const [parentFolder] = await db
        .select()
        .from(files)
        .where(
          and(
            eq(files.id, parentId),
            eq(files.userId, userId),
            eq(files.isFolder, true)
          )
        );
    } else {
      return NextResponse.json(
        { error: 'Parent folder not found' },
        { status: 404 }
      );
    }

    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    //when passing file to any upload function, it should be a buffer. For ex- imagekit
    const buffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(buffer);

    const folderPath = parentId
      ? `/vaultigo/${userId}/folder/${parentId}`
      : `/vaultigo/${userId}`;

    const originalFileName = file.name;
    const fileExtension = originalFileName.split('.').pop() || '';

    //check for empty extensions and also checking its only image and pdf
    if (!fileExtension) {
      return NextResponse.json({ error: 'Invalid file name' }, { status: 400 });
    }
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;

    const uploadResponse = await imagekit.upload({
      file: fileBuffer,
      fileName: uniqueFileName,
      folder: folderPath,
      useUniqueFileName: true,
    });

    const fileData = {
      name: originalFileName,
      path: uploadResponse.filePath,
      size: file.size,
      type: file.type,
      fileUrl: uploadResponse.url,
      thumbnailUrl: uploadResponse.thumbnailUrl || null,
      userId: userId,
      parentId: parentId,
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
