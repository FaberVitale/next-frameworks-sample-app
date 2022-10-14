import { component$ } from "@builder.io/qwik";
import { ArticleLink } from "~/api/wikipedia";

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
