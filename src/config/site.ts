/**
 * Edit this file to make the site yours. Nothing here needs a rebuild of any
 * component — every section, page, and meta tag reads from this object.
 */

export type TintKey = 'crimson' | 'cobalt' | 'emerald' | 'amber';

export const site = {
  name: 'Francis-Patrick Diallo',
  role: 'Regular DevOps Engineer',
  motto: 'Ora et labora',
  tagline:
    'I am a passionate Alumni of Polytechnic University of Bucharest, driven by a curiosity for technology and a love for creation. My journey involves delving into the world of computer science, exploring new ideas, getting the big picture, and adapt to new challenges. Some of my favorite IT topics are: Fullstack Development, AI (GenAI, Operation Research, ML), Mobile Applications, Internet of Things, etc.',
  url: 'https://diallofrancispatrick.com', // must match public/CNAME: canonical URLs, sitemap and JSON-LD use it
  location: 'Bucharest, Romania',
  languages: ['Romanian', 'English', 'French'],
  // Hero pills. Any topics, any number, any order.
  interests: ['Fullstack', 'DevOps', 'GenAI', 'Operations Research', 'Machine Learning', 'Mobile', 'IoT'],

  // Hero "Currently" block. Leave a value empty ('') to hide that row.
  currently: {
    building: 'Scheduling Optimization: School Timetabling and Conference Scheduling with Timefold',
    learning: 'Operations Research: Methods and Applications',
     reading: { title: 'TODO: the book you are reading', url: 'https://www.goodreads.com/user/show/144603964-patrickus23' },
  },

  availability: {
    open: true,
    text: 'Open to new opportunities and collaborations. Feel free to reach out!',
  },

  // Order = order on the page. Set visible:false to hide a section
  // (nav + station bar update automatically).
  sections: [
    { id: 'about', title: 'About', visible: true },
    { id: 'skills', title: 'Skills', visible: true },
    { id: 'experience', title: 'Experience', visible: true },
    { id: 'projects', title: 'Projects', visible: true },
    { id: 'education', title: 'Education & Certifications', visible: true },
    { id: 'blog', title: 'Blog', visible: true },
    { id: 'contact', title: 'Contact', visible: true },
  ],

  cv: {
    file: '/cv/Francis-Patrick_Diallo_CV_2026_latest.pdf',
    downloadName: 'Francis-Patrick_Diallo-CV.pdf',
    updated: '2026-08-01',
  },

  contact: {
    // Your email address is never published. Messages go through Formspree:
    // create a free form at https://formspree.io, then paste its ID here
    // (the part after /f/ in https://formspree.io/f/xxxxxxxx).
    // Empty = the form shows a short "being set up" note instead.
    formspreeId: 'xjykjknp',
    replyTime: 'I usually reply within 2 working days.',
  },

  socials: [
    { platform: 'github', url: 'https://github.com/PatrickDiallo23' },
    { platform: 'linkedin', url: 'https://www.linkedin.com/in/diallo-francis-patrick-4a1a61218/' },
    { platform: 'goodreads', url: 'https://www.goodreads.com/user/show/144603964-patrickus23' },
  ] as { platform: string; url: string }[], // icon picked from platform; delete a line to hide it

  links: [] as { label: string; url: string }[], // optional "Notes and resources"
  clientLogos: [] as { name: string; logo: string }[], // optional logo row

  defaults: {
    mode: 'system' as 'light' | 'dark' | 'system',
    accent: 'all' as 'all' | TintKey,
  },

  analytics: {
    // Cloudflare Web Analytics: dash.cloudflare.com > your domain > Analytics & Logs
    // > Web Analytics > Manage site > copy the token (safe to publish, it's a public beacon id).
    provider: 'cloudflare' as null | 'goatcounter' | 'cloudflare',
    id: '8808bcc4f06446aa95183cef8912eed5', // paste the token here to go live
  },
} as const;

export type Site = typeof site;
