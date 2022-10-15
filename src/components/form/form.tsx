import {
  component$,
  PropFunction,
  ResourceReturn,
  getPlatform,
  Signal,
} from "@builder.io/qwik";
import { SerachIcon } from "../icons/search";

type Props = {
  onSubmit$: PropFunction<(value: string) => void>;
  value: Signal<string>;
  resource: ResourceReturn<unknown>;
};

export const isLoading = (resource: ResourceReturn<unknown>) => {
  // The resource.state on the ssr is pending and becuase of resumabilty it never gets updated
  // https://github.com/BuilderIO/qwik/issues/1739
  return !getPlatform().isServer && resource.state === "pending";
};

export const Form = component$<Props>(({ onSubmit$, value, resource }) => {
  return (
    <form
      class="form-group query-form"
      preventdefault:submit
      onSubmit$={(event) => {
        const { elements } = event.target as any;

        onSubmit$(elements.q.value);
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
        // @ts-expect-error input.value accepts signals but the type is not updated
        value={value}
      />
      <button type="submit" class="btn-small" disabled={isLoading(resource)}>
        <span class="visually-hidden">submit</span>
        <SerachIcon />
      </button>
    </form>
  );
});
