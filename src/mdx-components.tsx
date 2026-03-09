import type { MDXComponents } from "mdx/types";

const cx = (base: string, extra?: string) =>
  extra ? `${base} ${extra}` : base;

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ className, ...props }) => (
      <h1
        className={cx(
          "text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl",
          className
        )}
        {...props}
      />
    ),
    h2: ({ className, ...props }) => (
      <h2
        className={cx(
          "text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl",
          className
        )}
        {...props}
      />
    ),
    h3: ({ className, ...props }) => (
      <h3
        className={cx(
          "text-xl font-semibold tracking-tight text-slate-900 md:text-2xl",
          className
        )}
        {...props}
      />
    ),
    p: ({ className, ...props }) => (
      <p
        className={cx("text-base leading-7 text-slate-700", className)}
        {...props}
      />
    ),
    ul: ({ className, ...props }) => (
      <ul
        className={cx("list-disc pl-5 text-slate-700", className)}
        {...props}
      />
    ),
    ol: ({ className, ...props }) => (
      <ol
        className={cx("list-decimal pl-5 text-slate-700", className)}
        {...props}
      />
    ),
    a: ({ className, ...props }) => (
      <a
        className={cx(
          "text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500",
          className
        )}
        {...props}
      />
    ),
    ...components,
  };
}
