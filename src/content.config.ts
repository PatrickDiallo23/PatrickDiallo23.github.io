import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const lineEnum = z.enum(['java', 'python', 'devops', 'ai']);
const levelEnum = z.enum(['daily', 'comfortable', 'learning']);

const experience = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/experience' }),
  schema: z.object({
    company: z.string(),
    role: z.string(),
    line: lineEnum,
    start: z.string().regex(/^\d{4}-\d{2}$/, 'start must be YYYY-MM'),
    end: z.string().regex(/^\d{4}-\d{2}$/, 'end must be YYYY-MM').nullable(),
    location: z.string(),
    url: z.string().url().optional(),
    plain: z.string().max(220, 'plain must be 220 characters or fewer'),
    highlights: z.array(z.string()).max(4, 'at most 4 highlights'),
    stack: z.array(z.string()),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    line: lineEnum,
    category: z.string(),
    plain: z.string().max(220, 'plain must be 220 characters or fewer'),
    stack: z.array(z.string()),
    image: z.string().optional(),
    repo: z.string().url().optional(),
    live: z.string().url().optional(),
    start: z.string().regex(/^\d{4}-\d{2}$/, 'start must be YYYY-MM'),
    end: z.string().regex(/^\d{4}-\d{2}$/).optional(),
    featured: z.boolean().default(false),
  }),
});

const education = defineCollection({
  loader: file('./src/content/education.yaml'),
  schema: z.object({
    degree: z.string(),
    school: z.string(),
    start: z.string(),
    end: z.string(),
    location: z.string().optional(),
    notes: z.string().optional(),
  }),
});

const certifications = defineCollection({
  loader: file('./src/content/certifications.yaml'),
  schema: z.object({
    name: z.string(),
    issuer: z.string(),
    issued: z.string().regex(/^\d{4}-\d{2}$/, 'issued must be YYYY-MM'),
    expires: z.string().regex(/^\d{4}-\d{2}$/).optional(),
    credentialId: z.string().optional(),
    url: z.string().url().optional(),
    line: lineEnum.optional(),
  }),
});

const skills = defineCollection({
  loader: file('./src/content/skills.yaml'),
  schema: z.object({
    name: z.string(),
    line: lineEnum,
    plain: z.string(),
    items: z.array(
      z.object({
        name: z.string(),
        level: levelEnum,
        icon: z.string().optional(),
      })
    ),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    summary: z.string().max(160, 'summary must be 160 characters or fewer'),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
    cover: z.string().optional(),
  }),
});

export const collections = { experience, projects, education, certifications, skills, blog };
