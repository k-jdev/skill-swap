"use client";

import { useCallback, useEffect } from "react";
import {
  useForm,
  type DefaultValues,
  type FieldValues,
  type Resolver,
  type SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { ZodType } from "zod";
import type { ActionResult } from "@/shared/types/action";
import { GENERIC_AUTH_ERROR } from "@/shared/lib/authErrors";

type UseAuthFormOptions<TValues extends FieldValues, TData> = {
  schema: ZodType<TValues>;
  action: (values: TValues) => Promise<ActionResult<TData>>;
  defaultValues?: DefaultValues<TValues>;
  /** Where to go on success. Return `null` to stay on the page. */
  redirectTo?: string | null | ((data: TData) => string | null);
  successMessage?: string | ((data: TData) => string | null);
  onSuccess?: (data: TData) => void;
};

/**
 * Template Method for every auth form: validate, call the server action,
 * surface a safe error, refresh the Server Components tree, then redirect.
 *
 * `router.refresh()` before `push` is what keeps the server-rendered
 * navigation in sync with the new session cookie.
 */
export function useAuthForm<TValues extends FieldValues, TData>({
  schema,
  action,
  defaultValues,
  redirectTo = "/",
  successMessage,
  onSuccess,
}: UseAuthFormOptions<TValues, TData>) {
  const router = useRouter();
  const form = useForm<TValues>({
    // The schema is generic here, so the resolver has to be re-typed:
    // zodResolver cannot prove `TValues` matches the schema output.
    resolver: zodResolver(schema as never) as unknown as Resolver<TValues>,
    defaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const {
    formState: { errors, isSubmitting, isSubmitted },
    setFocus,
  } = form;

  // Move focus to the first invalid field so keyboard and screen-reader users
  // land on the problem instead of hunting for it.
  useEffect(() => {
    if (!isSubmitted) return;
    const firstError = Object.keys(errors)[0];
    if (firstError && firstError !== "root") {
      setFocus(firstError as never);
    }
  }, [errors, isSubmitted, setFocus]);

  const submit = useCallback(
    async (values: TValues) => {
      try {
        const result = await action(values);

        if (!result.success) {
          form.setError("root", { message: result.error });
          toast.error(result.error);
          return;
        }

        const message =
          typeof successMessage === "function"
            ? successMessage(result.data)
            : successMessage;
        if (message) toast.success(message);

        onSuccess?.(result.data);

        const target =
          typeof redirectTo === "function" ? redirectTo(result.data) : redirectTo;

        if (target) {
          router.refresh();
          router.push(target);
        } else {
          router.refresh();
        }
      } catch {
        form.setError("root", { message: GENERIC_AUTH_ERROR });
        toast.error(GENERIC_AUTH_ERROR);
      }
    },
    [action, form, onSuccess, redirectTo, router, successMessage],
  );

  return {
    ...form,
    isSubmitting,
    onSubmit: form.handleSubmit(submit as SubmitHandler<TValues>),
  };
}
