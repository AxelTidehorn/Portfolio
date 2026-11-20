import { defineCollection, type SchemaContext } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One image record, shared by covers, galleries and project figures.
const picture = ({ image }: SchemaContext) =>
  z.object({
    src: image(),
    alt: z.string(),
    caption: z.string().optional(),
  });

const photography = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/photography' }),
  schema: (ctx) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      cover: picture(ctx),
      images: z.array(picture(ctx)).default([]),
      order: z.number().default(100),
      featured: z.boolean().default(false),
      // Marks records whose images/text are not final; shown as a visible badge.
      placeholder: z.boolean().default(false),
    }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: (ctx) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      disciplines: z.array(z.string()).default([]),
      status: z.string().optional(),
      cover: picture(ctx),
      gallery: z.array(picture(ctx)).default([]),
      // Free-form label/value rows rendered in the project's title block.
      meta: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
      links: z.array(z.object({ label: z.string(), href: z.url() })).default([]),
      order: z.number().default(100),
      featured: z.boolean().default(false),
      placeholder: z.boolean().default(false),
    }),
});

export const collections = { photography, projects };
