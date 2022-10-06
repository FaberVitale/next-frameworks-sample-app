import { createResource, JSX, Suspense, ErrorBoundary, For } from "solid-js";
import { fetchWikipediaOpenSearch } from "./api/wikipedia";

function getSearchTerm(): string | null {
  return new URLSearchParams(window.location.search).get("q");
}

function Articles() {
  const [searchResults] = createResource(
    getSearchTerm,
    fetchWikipediaOpenSearch
  );

  return (
    <ul class="wikipedia-links">
      <For each={searchResults()?.[1]} fallback={<div>0 results :(</div>}>
        {(title, idx) => (
          <li>
            <a
              target="_blank"
              class="paper-btn btn-primary-outline"
              rel="noopener noreferrer"
              href={searchResults()?.[3][idx()]}
            >
              {title}
            </a>
          </li>
        )}
      </For>
    </ul>
  );
}

export function App(): JSX.Element {
  const [searchResults] = createResource(
    getSearchTerm,
    fetchWikipediaOpenSearch
  );

  return (
    <article>
      <h1>Wikipedia search: {getSearchTerm() || ""}</h1>
      <ErrorBoundary
        fallback={
          <div class="alert alert-danger">{String(searchResults.error)}</div>
        }
      >
        <Suspense fallback={<div class="alert alert-primary">Loading...</div>}>
          <Articles />
        </Suspense>
      </ErrorBoundary>
    </article>
  );
}
