# armur-landing
Landing Webpage for Armur

## Search metadata and verification

Canonical URLs use HTTPS and trailing directory slashes. Update `sitemap.xml`
when adding public pages. Legacy HTML remains accessible but uses `noindex`;
robots.txt deliberately allows crawling so search engines can read that directive.

Run `python3 scripts/check_seo.py` before publishing. The check validates sitemap
pages, canonical URLs, descriptions, sharing metadata, JSON-LD, local image paths,
and legacy-page exclusions. Original photographs and scans remain available through
full-size links; WebP files are the lightweight display previews.

After publishing, submit `https://armur.org/sitemap.xml` in the site's verified
Google Search Console property and inspect the homepage, download page, and guides.
Search Console access/ownership verification is account-specific and is not part
of these source files. Review Core Web Vitals there and run PageSpeed Insights
against the deployed pages. No field-performance score has been verified yet.

The structured data describes real visible content; no ratings or reviews have
been invented. SoftwareApplication markup alone does not establish eligibility
for Google's app rich results, and the homepage video is supplementary content,
not a dedicated watch page. Validate deployed markup with Google's Rich Results
Test. HTTPS enforcement was enabled through GitHub Pages settings on 2026-11-22.
