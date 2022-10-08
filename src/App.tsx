import { createResource, JSX, Suspense, ErrorBoundary, For } from "solid-js";
import { fetchWikipediaOpenSearch } from "./api/wikipedia";

function getSearchTerm(): string | null {
  return new URLSearchParams(window.location.search).get("q") || null;
}

function Articles() {
  const [articles] = createResource(getSearchTerm, fetchWikipediaOpenSearch);

  return (
    <ul class="wikipedia-links">
      <For
        each={articles()}
        fallback={
          <li>
            <p>0 results :(</p>
          </li>
        }
      >
        {({ title, href }) => (
          <li>
            <a
              target="_blank"
              class="paper-btn btn-primary-outline"
              rel="noopener noreferrer"
              href={href}
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
  return (
    <article>
      <h1>Wikipedia search: {getSearchTerm() || ""}</h1>
      <ErrorBoundary
        fallback={(err) => <div class="alert alert-danger">{String(err)}</div>}
      >
        <Suspense fallback={<div class="alert alert-primary">Loading...</div>}>
          <Articles />
        </Suspense>
      </ErrorBoundary>
    </article>
  );
}
