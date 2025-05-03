import { db } from '@/lib/db';
import { files } from '@/lib/db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq, and } from 'drizzle-orm';
import ImageKit from 'imagekit';
import { NextResponse, NextRequest } from 'next/server';

var imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT!,
});

export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ fileId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { fileId } = await props.params;
    if (!fileId) {
      return NextResponse.json(
        { error: 'File ID is required' },
        { status: 400 }
      );
    }

    const [file] = await db
      .select()
      .from(files)
      .where(and(eq(files.id, fileId), eq(files.userId, userId)));

    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Delete file from ImageKit (not the folder)
    // Delete file from ImageKit if it's not a folder
    if (!file.isFolder) {
      try {
        let imagekitFileId = null;

        if (file.fileUrl) {
          //ex- https://ik.imagekit.io/xyz/sunset.png?some=extra
          const urlWithoutQuery = file.fileUrl.split('?')[0]; //?some=extra
          imagekitFileId = urlWithoutQuery.split('/').pop(); //sunset.png
        }

        if (!imagekitFileId && file.path) {
          imagekitFileId = file.path.split('/').pop();
        }

        if (imagekitFileId) {
          try {
            const searchResults = await imagekit.listFiles({
              name: imagekitFileId,
              limit: 1,
            });

            if (
              searchResults &&
              searchResults.length > 0 &&
              'fileId' in searchResults[0]
            ) {
              await imagekit.deleteFile(searchResults[0].fileId);
            } else {
              await imagekit.deleteFile(imagekitFileId);
            }
          } catch (searchError) {
            console.error(`Error searching for file in ImageKit:`, searchError);
            await imagekit.deleteFile(imagekitFileId);
          }
        }
      } catch (error) {
        console.error(`Error deleting file ${fileId} from ImageKit:`, error);
      }
    }

    const [deletedFile] = await db
      .delete(files)
      .where(and(eq(files.id, fileId), eq(files.userId, userId)))
      .returning();

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully',
      deletedFile,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
