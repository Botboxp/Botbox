import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/content/', '/admin/'],
    },
    sitemap: 'https://www.botboxp.com/sitemap.xml',
  }
}
