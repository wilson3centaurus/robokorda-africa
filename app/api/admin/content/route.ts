import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/admin/auth';
import { getContent, setContent } from '@/lib/admin/content-manager';

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const page = request.nextUrl.searchParams.get('page');
  if (!page) {
    return NextResponse.json({ error: 'Page parameter required' }, { status: 400 });
  }
  const content = await getContent(page);
  return NextResponse.json({ content: content || {} });
}

export async function PUT(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { page, content } = await request.json();
    if (!page || typeof page !== 'string') {
      return NextResponse.json({ error: 'Page required' }, { status: 400 });
    }
    if (!content || typeof content !== 'object') {
      return NextResponse.json({ error: 'Content required' }, { status: 400 });
    }
    await setContent(page, content);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 });
  }
}
