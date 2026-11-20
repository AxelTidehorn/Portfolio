import { getCollection } from 'astro:content';

const byOrder = (a: { data: { order: number } }, b: { data: { order: number } }) => a.data.order - b.data.order;

export const getSeries = async () => (await getCollection('photography')).sort(byOrder);
export const getProjects = async () => (await getCollection('projects')).sort(byOrder);

// Photography and projects as one list, for the homepage and the index table.
export async function getAllWork() {
  const series = (await getSeries()).map((s) => ({
    href: `/photography/${s.id}/`,
    kind: 'Photography',
    status: undefined as string | undefined,
    ...s.data,
  }));
  const projects = (await getProjects()).map((p) => ({
    href: `/projects/${p.id}/`,
    kind: p.data.disciplines.join(' / ') || 'Project',
    ...p.data,
  }));
  return [...series, ...projects];
}
