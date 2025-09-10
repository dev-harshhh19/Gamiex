const fs = require('fs');
const path = require('path');

const baseUrl = 'https://gamiex.vercel.app';

// Add your dynamic routes here
const routes = [
  {
    url: '/',
    changefreq: 'daily',
    priority: 1.0
  },
  {
    url: '/about',
    changefreq: 'monthly',
    priority: 0.8
  },
  {
    url: '/products',
    changefreq: 'daily',
    priority: 0.9
  },
  {
    url: '/contact',
    changefreq: 'monthly',
    priority: 0.7
  }
];

const generateSitemap = () => {
  const today = new Date().toISOString().split('T')[0];
  
  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${baseUrl}${route.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  fs.writeFileSync(
    path.join(__dirname, '../public/sitemap.xml'),
    sitemapContent
  );
};

generateSitemap();
