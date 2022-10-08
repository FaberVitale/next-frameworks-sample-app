export type WikipediaSearchResult = [
  /*  query */
  string,
  /* title */
  string[],
  /* description */
  string[],
  /* url */
  string[]
];

export interface ArticleLink {
  title: string;
  href: string;
}

function delay(delayMs: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, delayMs));
}

export async function fetchWikipediaOpenSearch(
  query: string
): Promise<ArticleLink[]> {
  const queryUrl = new URL(
    "https://en.wikipedia.org/w/api.php?action=opensearch&limit=100&namespace=0&format=json&origin=*"
  );

  queryUrl.searchParams.set("search", query);

  const res = await fetch(queryUrl, {
    headers: {
      accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`fetch error: status ${res.status}`);
  }

  await delay(2_000);

  const [, titleList, , urlList]: WikipediaSearchResult =
    (await res.json()) as WikipediaSearchResult;

  return titleList.map((title, i) => ({ title, href: urlList[i] }));
}
