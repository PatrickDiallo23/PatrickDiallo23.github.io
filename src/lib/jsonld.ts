import { site } from '../config/site';

export function personJsonLd(knowsAbout: string[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${site.url}/#person`,
    name: site.name,
    givenName: 'Francis-Patrick',
    familyName: 'Diallo',
    alternateName: site.alternateNames,
    jobTitle: site.role,
    url: site.url,
    image: new URL('/og-default.png', site.url).toString(),
    mainEntityOfPage: site.url,
    alumniOf: { '@type': 'CollegeOrUniversity', name: 'Polytechnic University of Bucharest' },
    sameAs: site.socials.map((s) => s.url),
    description: site.description,
    address: { '@type': 'PostalAddress', addressLocality: site.location },
    knowsAbout,
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: site.url,
    inLanguage: 'en',
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function blogPostingJsonLd(post: {
  title: string;
  summary: string;
  date: Date;
  updated?: Date;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.summary,
    datePublished: post.date.toISOString(),
    dateModified: (post.updated ?? post.date).toISOString(),
    author: { '@type': 'Person', name: site.name },
    url: post.url,
  };
}
