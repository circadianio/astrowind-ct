const DIRECTUS_URL = import.meta.env.DIRECTUS_URL;

type Page = {
  slug: string;
  title: string;
  hero_text: string;
  body: string;
};

export async function getPageBySlug(slug: string): Promise<Page | null> {
  if (!DIRECTUS_URL) {
    console.warn("DIRECTUS_URL not set");
    return null;
  }

  const url = `${DIRECTUS_URL}/items/pages?filter[slug][_eq]=${encodeURIComponent(
    slug,
  )}`;

  const res = await fetch(url);

  if (!res.ok) {
    console.error("Failed to fetch page from Directus", await res.text());
    return null;
  }

  const json = await res.json();
  return (json.data?.[0] as Page) ?? null;
}
