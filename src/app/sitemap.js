import { env } from '@/config/env';

export default function sitemap() {
  return [
    {
      url: `${env.appUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
