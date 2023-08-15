import { existsSync } from 'fs';
import { unlink, writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const avatarFile = formData.get('avatarFile') as File;
  const intraID = formData.get('intraID') as string;
  const oldAvatarPath = formData.get('oldAvatarPath') as string;

  if (!avatarFile) {
    return NextResponse.json({ success: false });
  }

  const bytes = await avatarFile.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const path = `avatars/${intraID}-${avatarFile.name}`;

  if (existsSync(`${process.cwd()}/public/${oldAvatarPath}`)) {
    await unlink(`${process.cwd()}/public/${oldAvatarPath}`);
  }
  await writeFile(`${process.cwd()}/public/${path}`, buffer);
  return NextResponse.json({ success: true, path: path });
}
