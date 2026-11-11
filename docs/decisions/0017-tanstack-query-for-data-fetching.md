# 0017. TanStack Query for data fetching

- Status: Accepted
- Date: 2026-11-11

## Context

The mobile app fetched its items in `InventoryList` with `useState` and `useEffect`, tracking loading and error states by hand. Moving that into a `useItems` hook (#52) kept components to display only, but the hook still had to handle loading, errors and the promise itself, and every new hook would repeat it. Coming screens need more than one fetch on mount: the item detail screen (#47) loads a single item that the list may already have, and adding, editing and deleting items will need the list to refresh afterwards.

## Decision

Use TanStack Query (`@tanstack/react-query`, v5) for server data in the mobile app. Hooks in `src/hooks/` wrap `useQuery` around the functions in `src/api/`, and one `QueryClient` is provided in the root `_layout.tsx`. Components read `data`, `isLoading` and `error` from the hooks, and never call the API functions directly.

## Alternatives considered

- **Hand-written hooks with `useEffect`:** no dependency, but each hook repeats the loading and error state, and caching, refetching after a change, and ignoring a response that arrives after the screen has gone would all be written by hand.
- **SWR:** smaller and similar for reading data, but its support for mutations, such as invalidating related queries after a write, is thinner, and it has no dev tools of its own.
- **RTK Query:** brings Redux Toolkit, and a store the app doesn't otherwise need.
- **Apollo or Relay:** built for GraphQL. The API is REST.

## Consequences

- Hooks shrink to a query key and a fetch function. Loading and error states, caching and request de-duplication come from the library, and later writes can use `useMutation` and invalidate the `['items']` key.
- Query keys need to be kept consistent, because they decide what's cached and shared. A per-item query, such as `['items', id]`, doesn't read from the list's cache unless it's set up to.
- Errors are typed as `Error`, but a rejection with any other value is passed through unchanged. The API functions only throw `Error`s.
- Tests render through `renderWithClient` in `src/__tests__/utils.tsx`, which gives each test a fresh client with retries off and cache garbage collection off. With the default 5-minute garbage collection timer, Jest didn't exit until it fired. Queries resolve after the first render, so tests wait with `findBy*`.
- Refetching when the app returns to the foreground or comes back online needs React Native wiring (`focusManager` with `AppState`, `onlineManager` with a network listener), which isn't set up yet. Add it when stale data becomes a problem.
- Revisit if the app adds a global client store, such as Redux, that could manage server state too.
