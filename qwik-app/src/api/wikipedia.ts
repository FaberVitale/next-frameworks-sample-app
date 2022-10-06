import { delay } from "../lib/delay";

type WikipediaSearchResult = [
  query: string,
  title: string[],
  description: string[],
  url: string[]
];

export type ArticleLink = {
  title: string;
  href: string;
};

export async function fetchWikipediaOpenSearch(
  query: string,
  signal?: AbortSignal
): Promise<ArticleLink[]> {
  const queryUrl = new URL(
    "https://en.wikipedia.org/w/api.php?action=opensearch&limit=100&namespace=0&format=json&origin=*"
  );

  queryUrl.searchParams.set("search", query);

  const res = await fetch(queryUrl.toString(), {
    headers: {
      accept: "application/json",
    },
    signal,
  });

  if (!res.ok) {
    throw new Error(`fetch error: status ${res.status}`);
  }

  await delay(2_000, signal);

  const [, titleList, , urlList]: WikipediaSearchResult = await res.json();

  return titleList.map((title, i) => ({ title, href: urlList[i] }));
}
