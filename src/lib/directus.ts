const DIRECTUS_URL =
  import.meta.env.DIRECTUS_URL ?? 'https://directus-production-89bd.up.railway.app';

if (!DIRECTUS_URL) {
  console.warn("DIRECTUS_URL is not set. Directus helpers will return empty data.");
}

export type Page = {
  id: number;
  slug: string;
  title: string;
  hero_text?: string;
  body?: string;
};

export type FeatureItem = {
  id: number;
  title: string;
  description?: string;
  icon?: string;
};

export type Section = {
  id: number;
  layout_type: string;
  sort?: number;
  anchor_id?: string | null;
  tagline?: string | null;
  title?: string | null;
  subtitle?: string | null;
  body?: string | null;
  image_url?: string | null;
  image_alt?: string | null;
  primary_action_label?: string | null;
  primary_action_href?: string | null;
  secondary_action_label?: string | null;
  secondary_action_href?: string | null;
  feature_items?: FeatureItem[];
};

async function fetchJson(path: string) {
  if (!DIRECTUS_URL) return null;

  const res = await fetch(`${DIRECTUS_URL}${path}`);

  if (!res.ok) {
    console.error("Directus fetch failed:", path, res.status, await res.text());
    return null;
  }

  return res.json();
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const json = await fetchJson(
    `/items/pages?filter[slug][_eq]=${encodeURIComponent(slug)}`
  );

  if (!json || !json.data || !json.data[0]) return null;
  return json.data[0] as Page;
}

export async function getSectionsForPage(slug: string): Promise<Section[]> {
  const json = await fetchJson(
    `/items/sections` +
      `?filter[page][slug][_eq]=${encodeURIComponent(slug)}` +
      `&fields=*,feature_items.*` +
      `&sort=sort`
  );

  if (!json || !Array.isArray(json.data)) return [];
  return json.data as Section[];
}
