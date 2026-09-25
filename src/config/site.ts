/**
 * Edit this file to make the site yours. Nothing here needs a rebuild of any
 * component — every section, page, and meta tag reads from this object.
 */

export type LineKey = 'java' | 'python' | 'devops' | 'ai';

export const site = {
  name: 'Your Name',
  role: 'Regular DevOps Engineer',
  tagline:
    'I build software that keeps working: backends, the pipelines that ship them, and the AI features on top.',
  url: 'https://your-username.github.io',
  location: 'City, Country',
  languages: ['English', 'French'],
  availability: {
    open: true,
    text: 'Open to new roles from January 2027',
  },

  // Order = order on the page. Set visible:false to hide a section
  // (nav + station bar update automatically).
  sections: [
    { id: 'about', title: 'About', visible: true },
    { id: 'skills', title: 'Skills', visible: true },
    { id: 'experience', title: 'Experience', visible: true },
    { id: 'projects', title: 'Projects', visible: false },
    { id: 'education', title: 'Education & certifications', visible: true },
    { id: 'blog', title: 'Blog', visible: true },
    { id: 'contact', title: 'Contact', visible: true },
  ],

  cv: {
    file: '/cv/cv.pdf',
    downloadName: 'YourName-CV.pdf',
    updated: '2026-09-01',
  },

  contact: {
    email: 'you@example.com',
    // "mailto"     – form opens the visitor's email app with the message prefilled (no third party). Default.
    // "formsubmit" – form posts to FormSubmit (free, no account). Set formsubmitId after activating.
    // "links"      – no form; only email (copy button + mailto link) and socials.
    mode: 'mailto' as 'mailto' | 'formsubmit' | 'links',
    formsubmitId: '',
    replyTime: 'I usually reply within 2 working days.',
  },

  socials: [
    { platform: 'github', url: 'https://github.com/your-username' },
    { platform: 'linkedin', url: 'https://www.linkedin.com/in/your-username' },
  ] as { platform: string; url: string }[], // icon picked from platform; delete a line to hide it

  links: [] as { label: string; url: string }[], // optional "Notes and resources"
  clientLogos: [] as { name: string; logo: string }[], // optional logo row

  defaults: {
    mode: 'system' as 'light' | 'dark' | 'system',
    accent: 'all' as 'all' | LineKey,
  },

  lines: {
    java: 'Java',
    python: 'Python',
    devops: 'DevOps',
    ai: 'AI',
  } as Record<LineKey, string>,

  analytics: {
    provider: null as null | 'goatcounter' | 'cloudflare',
    id: '',
  },
} as const;

export type Site = typeof site;
