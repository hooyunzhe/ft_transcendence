import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const intraID = formData.get('intraID') as string;

  if (!file) {
    return NextResponse.json({ success: false });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const fileExtension = file.name.slice(file.name.lastIndexOf('.'));
  const path = `avatars/${intraID}${fileExtension}`;

  await writeFile(`${process.cwd()}/public/${path}`, buffer);
  return NextResponse.json({ success: true, path: path });
}
