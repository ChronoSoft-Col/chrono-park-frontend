import { z, ZodTypeAny } from "zod";

import { IPageProps } from "@/src/shared/interfaces/generic/page-props.interface";

type SearchParamsInput = IPageProps["searchParams"];

type NormalizedSearchParams = Record<string, string | undefined>;

const normalizeSearchParams = (
  searchParams?: SearchParamsInput
): NormalizedSearchParams => {
  if (!searchParams) {
    return {};
  }

  return Object.entries(searchParams).reduce<NormalizedSearchParams>(
    (acc, [key, value]) => {
      const firstValue = Array.isArray(value) ? value[0] : value;
      acc[key] = firstValue === "" ? undefined : firstValue;
      return acc;
    },
    {}
  );
};

export const buildSearchParams = <TSchema extends ZodTypeAny>(
  schema: TSchema,
  searchParams?: SearchParamsInput,
  overrides?: Record<string, unknown>
): z.output<TSchema> => {
  const normalized = normalizeSearchParams(searchParams);

  const merged: Record<string, unknown> = {
    ...normalized,
    ...overrides,
  };

  for (const [key, value] of Object.entries(merged)) {
    if (value === "") {
      merged[key] = undefined;
    }
  }

  return schema.parse(merged);
};

export { normalizeSearchParams };
