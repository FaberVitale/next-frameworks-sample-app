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
      <h1>
        Wikipedia search:{" "}
        <form
          preventDefault:submit
          onSubmit$={(event) => {
            const { elements } = event.target as any;

            searchTerm.value = elements.search.value;
          }}
        >
          <input name="search" value={initialValue} disabled={loading} />
          <button type="submit" disabled={loading}>
            Ok
          </button>
        </form>
      </h1>
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
