"use client";

import NextLink from "next/link";
import {
  useParams as useNextParams,
  usePathname,
  useRouter,
  useSearchParams as useNextSearchParams,
} from "next/navigation";
import { forwardRef, useCallback } from "react";

export const Link = forwardRef(function Link(
  { to, replace = false, state: _state, ...props },
  ref
) {
  const href =
    typeof to === "string"
      ? to
      : to?.pathname
        ? `${to.pathname}${to.search || ""}${to.hash || ""}`
        : "/";

  return <NextLink ref={ref} href={href} replace={replace} {...props} />;
});

export function useNavigate() {
  const router = useRouter();

  return useCallback(
    (to, options = {}) => {
      if (typeof to === "number") {
        if (to < 0) router.back();
        else if (to > 0) router.forward();
        return;
      }

      const href =
        typeof to === "string"
          ? to
          : `${to?.pathname || "/"}${to?.search || ""}${to?.hash || ""}`;

      if (options.replace) router.replace(href, { scroll: options.scroll });
      else router.push(href, { scroll: options.scroll });
    },
    [router]
  );
}

export function useLocation() {
  const pathname = usePathname() || "/";
  const hash = typeof window === "undefined" ? "" : window.location.hash;

  return {
    pathname,
    search: typeof window === "undefined" ? "" : window.location.search,
    hash,
    state: null,
    key: pathname,
  };
}

export function useNavigationType() {
  return "PUSH";
}

export function useParams() {
  return useNextParams();
}

export function useSearchParams() {
  return [useNextSearchParams()];
}
