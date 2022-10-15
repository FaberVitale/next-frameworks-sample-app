import {
  component$,
  useSignal,
  useResource$,
  Resource,
  $,
  useClientEffect$,
} from "@builder.io/qwik";
import { DocumentHead, useLocation, useNavigate } from "@builder.io/qwik-city";
import { ArticleLink, fetchWikipediaOpenSearch } from "~/api/wikipedia";
import { Articles } from "~/components/articles/articles";
import { Form } from "~/components/form/form";

export default component$(() => {
  const location = useLocation();
  const navigate = useNavigate();

  const initialValue = location.query.q || "";
  const searchTerm = useSignal(initialValue);

  const searchResource = useResource$<ArticleLink[]>(async (ctx) => {
    ctx.track(() => searchTerm.value);

    const value = await fetchWikipediaOpenSearch(searchTerm.value);

    return value;
  });

  const handleSubmit = $((value: string) => {
    searchTerm.value = value;

    const url = new URL(location.href);

    url.searchParams.set("q", searchTerm.value);

    navigate.path = url.toString();
  });

  useClientEffect$((ctx) => {
    ctx.track(() => searchTerm.value);

    console.log("Hello from Qwik!");
  });

  return (
    <main>
      <nav class="border split-nav navbar">
        <div class="nav-brand">
          <a href="https://romajs.org/">RomaJS</a>
        </div>
        <Form
          onSubmit$={handleSubmit}
          value={searchTerm}
          resource={searchResource}
        />
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
