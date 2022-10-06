import {
  component$,
  useStore,
  useResource$,
  Resource,
  useClientEffect$,
} from "@builder.io/qwik";
import { DocumentHead, useLocation, useNavigate } from "@builder.io/qwik-city";
import { ArticleLink, fetchWikipediaOpenSearch } from "~/api/wikipedia";
import { delay } from "~/lib/delay";

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

  const searchTerm = useStore({
    value: location.query.q || "",
  });

  useClientEffect$((ctx) => {
    ctx.track(() => searchTerm.value);

    const url = new URL(location.href);

    url.searchParams.set("q", searchTerm.value);

    navigate.path = url.toString();
  });

  const searchResource = useResource$<ArticleLink[]>(async (ctx) => {
    ctx.track(() => searchTerm.value);

    if (searchTerm.value.length < 2) return ctx.previous || [];

    const controller = new AbortController();

    ctx.cleanup(() => {
      controller.abort();
    });

    // Debounce
    await delay(400, controller.signal);

    const value = await fetchWikipediaOpenSearch(
      searchTerm.value,
      controller.signal
    );

    return value;
  });

  return (
    <main>
      <h1>
        Wikipedia search:{" "}
        <input
          value={searchTerm.value}
          onInput$={({ target }) => {
            const { value } = target as HTMLInputElement;

            searchTerm.value = value;
          }}
        />
      </h1>
      <Resource
        value={searchResource}
        onResolved={(articles) => <Articles data={articles}></Articles>}
      />
    </main>
  );
});

export const head: DocumentHead = {
  title: "Qwik - Wikipedia Search",
};
