import {
  component$,
  useStore,
  useResource$,
  Resource,
  $,
} from "@builder.io/qwik";
import { DocumentHead, useLocation, useNavigate } from "@builder.io/qwik-city";
import { ArticleLink, fetchWikipediaOpenSearch } from "~/api/wikipedia";
import { Articles } from "~/components/articles/articles";
import { Form } from "~/components/form/form";

export default component$(() => {
  const location = useLocation();
  const navigate = useNavigate();

  const initialValue = location.query.q || "";
  const searchTerm = useStore({
    value: initialValue,
  });

  const searchResource = useResource$<ArticleLink[]>(async (ctx) => {
    ctx.track(() => searchTerm.value);

    const value = await fetchWikipediaOpenSearch(searchTerm.value);

    return value;
  });

  const handleSubmit = $((value: string) => {
    searchTerm.value = value;

    const url = new URL(location.href);

    url.searchParams.set("q", value);

    navigate.path = url.toString();
  });

  return (
    <main>
      <nav class="border fixed split-nav navbar">
        <div class="nav-brand">
          <a href="https://romajs.org/">RomaJS</a>
        </div>
        <Form onSubmit$={handleSubmit} value={searchTerm.value} />
      </nav>
      <Resource
        value={searchResource}
        onPending={() => <div>Loading...</div>}
        onResolved={(articles) => <Articles data={articles} />}
      />
    </main>
  );
});

export const head: DocumentHead = {
  title: "Qwik - Wikipedia Search",
};
