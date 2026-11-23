"""Validate canonical URLs, metadata, structured data, and local SEO assets."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import json
import xml.etree.ElementTree as ET
ROOT = Path(__file__).resolve().parents[1]
class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.meta={}; self.links=[]; self.images=[]; self.h1=0; self.schema=[]; self.capture=False; self.buffer=''
    def handle_starttag(self,tag,attrs):
        d=dict(attrs)
        if tag=='meta': self.meta[d.get('name',d.get('property',''))]=d.get('content','')
        if tag=='link': self.links.append(d)
        if tag=='img': self.images.append(d)
        if tag=='h1': self.h1+=1
        if tag=='script' and d.get('type')=='application/ld+json': self.capture=True; self.buffer=''
    def handle_data(self,data):
        if self.capture:self.buffer+=data
    def handle_endtag(self,tag):
        if tag=='script' and self.capture:self.schema.append(json.loads(self.buffer)); self.capture=False
urls=[e.text for e in ET.parse(ROOT/'sitemap.xml').iter('{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
assert len(urls)==len(set(urls))
for url in urls:
    path=ROOT/urlsplit(url).path.lstrip('/')/'index.html'
    p=Page();p.feed(path.read_text())
    assert [d['href'] for d in p.links if d.get('rel')=='canonical']==[url],path
    assert p.h1==1 and p.schema and p.meta.get('description'),path
    assert 'noindex' not in p.meta.get('robots',''),path
    assert p.meta['og:url']==url and p.meta['twitter:card']=='summary_large_image',path
    assert (ROOT/urlsplit(p.meta['og:image']).path.lstrip('/')).is_file(),path
    for img in p.images:
        assert 'alt' in img,path
        src=urlsplit(img.get('src','')).path
        if src.startswith('/'):assert (ROOT/unquote(src).lstrip('/')).is_file(),src
for f in ['index-recent.html','social/index-social.html','Adnav/index.html',*[str(p.relative_to(ROOT)) for p in (ROOT/'Adnav/Not used').glob('*.html')]]:
    p=Page();p.feed((ROOT/f).read_text());assert 'noindex' in p.meta.get('robots',''),f
assert 'Sitemap: https://armur.org/sitemap.xml' in (ROOT/'robots.txt').read_text()
print(f'Passed: {len(urls)} sitemap pages, canonical URLs, metadata, JSON-LD, images, and archive exclusions.')
