import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cx("mx-auto w-full max-w-5xl px-6", className)}>
      {children}
    </div>
  );
}
