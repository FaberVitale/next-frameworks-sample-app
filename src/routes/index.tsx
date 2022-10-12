import {
  component$,
  useStore,
  useResource$,
  Resource,
  useClientEffect$,
} from "@builder.io/qwik";
import { DocumentHead, useLocation, useNavigate } from "@builder.io/qwik-city";
import { ArticleLink, fetchWikipediaOpenSearch } from "~/api/wikipedia";

export const Articles = component$((props: { data: ArticleLink[] }) => {
  return (
    <ul class="wikipedia-links">
      {props.data.map(({ title, href }) => (
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
      ))}
    </ul>
  );
});

export default component$(() => {
  const location = useLocation();
  const navigate = useNavigate();

  const initialValue = location.query.q || "";
  const searchTerm = useStore({
    value: initialValue,
  });

  useClientEffect$((ctx) => {
    ctx.track(() => searchTerm.value);

    const url = new URL(location.href);

    url.searchParams.set("q", searchTerm.value);

    navigate.path = url.toString();
  });

  const searchResource = useResource$<ArticleLink[]>(async (ctx) => {
    ctx.track(() => searchTerm.value);

    const value = await fetchWikipediaOpenSearch(searchTerm.value);

    return value;
  });

  const loading = searchResource.state === "pending";

  return (
    <main>
      <nav class="border fixed split-nav navbar">
        <div class="nav-brand">
          <a href="https://romajs.org/">RomaJS</a>
        </div>
        <form
          class="form-group query-form"
          preventDefault:submit
          onSubmit$={(event) => {
            const { elements } = event.target as any;

            searchTerm.value = elements.q.value;
          }}
        >
          <label class="visually-hidden" for="q">
            Search wikipedia
          </label>
          <input
            type="search"
            name="q"
            placeholder="query wikipedia"
            id="q"
            value={initialValue}
            disabled={loading}
          />
          <button type="submit" class="btn-small" disabled={loading}>
            <span class="visually-hidden">submit</span>
            <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
              <g>
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
              </g>
            </svg>
          </button>
        </form>
      </nav>
      <Resource
        value={searchResource}
        onPending={() => <div>Loading...</div>}
        onResolved={(articles) => <Articles data={articles}></Articles>}
      />
    </main>
  );
});

export const head: DocumentHead = {
  title: "Qwik - Wikipedia Search",
};
