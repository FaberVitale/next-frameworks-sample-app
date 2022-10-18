import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { ArticleLink } from "~/api/wikipedia";
import css from "./articles.css?inline";

export const Articles = component$((props: { data: ArticleLink[] }) => {
  useStylesScoped$(css);

  console.log("Render Articles!");

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
