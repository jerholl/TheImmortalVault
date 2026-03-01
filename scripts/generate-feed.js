/**
 * Generates a static feed.xml for Creature Feature Lab.
 * Run: node scripts/generate-feed.js
 * Works on any hosting (Netlify, GitHub Pages, Vercel, etc.)
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ID = 'xeqvf5vl';
const DATASET = 'production';
const API_VERSION = '2023-10-01';
const SITE_URL = 'https://theimmortalvault.com';
const FEED_TITLE = 'Creature Feature Lab — The Immortal Vault';
const FEED_DESC = 'Horror production notes, filmmaking insights, and new story dispatches from The Immortal Vault.';

function escapeXml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toRfc822(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toUTCString();
}

function plainTextFromBlocks(blocks) {
  if (!Array.isArray(blocks)) return '';
  return blocks
    .filter((b) => b && b._type === 'block' && Array.isArray(b.children))
    .map((b) => b.children.map((c) => (c && c.text) || '').join('').trim())
    .filter(Boolean)
    .join('\n\n');
}

async function main() {
  const query = encodeURIComponent(`
    *[_type == "post"] | order(publishedAt desc) [0...50] {
      title,
      "slug": slug.current,
      publishedAt,
      excerpt,
      body,
      "coverImageUrl": coverImage.asset->url
    }
  `);

  const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${query}`;

  const res = await fetch(url);
  const data = await res.json();
  const posts = data.result || [];

  const items = posts.map((p) => {
    const postUrl = `${SITE_URL}/dispatch-post?slug=${encodeURIComponent(p.slug)}`;
    const content = p.excerpt || plainTextFromBlocks(p.body) || '';
    const truncated = content.length > 500 ? content.substring(0, 500) + '…' : content;

    let item = `
    <item>
      <title>${escapeXml(p.title || 'Untitled post')}</title>
      <link>${escapeXml(postUrl)}</link>
      <guid isPermaLink="true">${escapeXml(postUrl)}</guid>
      <pubDate>${toRfc822(p.publishedAt)}</pubDate>
      <description>${escapeXml(truncated)}</description>`;

    if (p.coverImageUrl) {
      item += `
      <enclosure url="${escapeXml(p.coverImageUrl)}" type="image/jpeg" />`;
    }

    item += `
    </item>`;

    return item;
  });

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(FEED_TITLE)}</title>
    <link>${SITE_URL}/dispatch</link>
    <description>${escapeXml(FEED_DESC)}</description>
    <language>en-us</language>
    <lastBuildDate>${toRfc822(new Date().toISOString())}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items.join('')}
  </channel>
</rss>`;

  const outPath = path.join(__dirname, '..', 'feed.xml');
  fs.writeFileSync(outPath, rss, 'utf8');
  console.log(`Generated ${outPath} with ${posts.length} posts`);
}

main().catch((err) => {
  console.error('Failed to generate feed:', err);
  process.exit(1);
});
