import { type ReactNode } from "react";
import clsx from "clsx";
import { type ClassNameValue } from "tailwind-merge";

type ChronoTitleProps = {
  children: ReactNode;
  className?: ClassNameValue;
  type?: "h1" | "h2" | "h3";
};

export default function ChronoTitle({
  children,
  className,
  type = "h1",
}: ChronoTitleProps) {
  const Tag = type;

  return (
    <Tag
      className={clsx(
        "chrono-title text-xl font-semibold tracking-tight text-foreground",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
