import { env } from '@/config/env';

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: ['/login', '/offline'],
      disallow: ['/admin', '/home', '/profile', '/progress', '/bookmarks', '/subjects'],
    },
    sitemap: `${env.appUrl}/sitemap.xml`,
  };
}
