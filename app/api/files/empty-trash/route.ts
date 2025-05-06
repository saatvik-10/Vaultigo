import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { files } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import ImageKit from 'imagekit';

var imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || '',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
  urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT || '',
});

export async function DELETE() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    //all files in trash for this user
    const filesInTrash = await db
      .select()
      .from(files)
      .where(and(eq(files.isTrashed, true), eq(files.userId, userId)));

    if (filesInTrash.length === 0) {
      return NextResponse.json(
        { message: 'No files in trash' },
        { status: 404 }
      );
    }

    //delete files from imagekit
    const deletePromises = filesInTrash
      .filter((file) => !file.isFolder)
      .map(async (file) => {
        try {
          let imagekitFileId = null;

          if (file.fileUrl) {
            const urlWithoutQuery = file.fileUrl.split('?')[0];
            imagekitFileId = urlWithoutQuery.split('/').pop();
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
              console.error(
                `Error searching for file in ImageKit:`,
                searchError
              );
              await imagekit.deleteFile(imagekitFileId); // fallback delete
            }
          }
        } catch (err) {
          console.error(`Error deleting file from ImageKit:`, err);
        }
      });

    //wait for all ImageKit deletions to complete (or fail)
    await Promise.allSettled(deletePromises);

    //delete from db
    const deletedFiles = await db
      .delete(files)
      .where(and(eq(files.userId, userId), eq(files.isTrashed, true)))
      .returning();

    return NextResponse.json({
      success: true,
      message: `All ${deletedFiles.length} file(s) in trash deleted successfully`,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
