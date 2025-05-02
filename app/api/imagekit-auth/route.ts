import ImageKit from 'imagekit';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

var imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT!,
});

export async function GET() {
  try {
    const userId = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const authParameters = imagekit.getAuthenticationParameters();
    return NextResponse.json(authParameters);
  } catch (err) {
    return NextResponse.json(
      { error: 'ImageKit auth failed', err },
      { status: 500 }
    );
  }
}
