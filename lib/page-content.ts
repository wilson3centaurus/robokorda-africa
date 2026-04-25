import { getContent } from '@/lib/admin/content-manager';

export interface ContentItem {
  label: string;
  value: string;
  imageSrc?: string;
  type: string;
}

export type PageContent = Record<string, ContentItem[]>;

export async function getPageContent(page: string): Promise<PageContent> {
  const raw = await getContent(page);
  return (raw as PageContent) || {};
}
