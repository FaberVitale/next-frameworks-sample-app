import { component$, PropFunction } from "@builder.io/qwik";
import { SerachIcon } from "../icons/search";

type Props = {
  onSubmit$: PropFunction<(value: string) => void>;
  value: string;
};

export const Form = component$<Props>((props) => {
  return (
    <form
      class="form-group query-form"
      preventdefault:submit
      onSubmit$={(event) => {
        const { elements } = event.target as any;

        props.onSubmit$(elements.q.value);
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
        value={props.value}
      />
      <button type="submit" class="btn-small">
        <span class="visually-hidden">submit</span>
        <SerachIcon />
      </button>
    </form>
  );
});
