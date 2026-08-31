import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const refresh = vi.fn();
const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh, push }),
  useSearchParams: () => new URLSearchParams(),
}));

const toastError = vi.fn();
const toastSuccess = vi.fn();

vi.mock("sonner", () => ({
  toast: { error: (m: string) => toastError(m), success: (m: string) => toastSuccess(m) },
}));

const { useAuthForm } = await import("@/features/auth/model/useAuthForm");
const { registerSchema } = await import("@/features/auth/schemas");
const { Input, PasswordInput, Button } = await import("@/shared/ui");

type RegisterValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

/**
 * Mirror of RegisterForm's wiring, isolated from the real server action.
 */
function TestForm({
  action,
}: {
  action: (values: RegisterValues) => Promise<
    | { success: true; data: { needsEmailConfirmation: boolean } }
    | { success: false; error: string; code?: string }
  >;
}) {
  const {
    register,
    onSubmit,
    isSubmitting,
    formState: { errors },
  } = useAuthForm<RegisterValues, { needsEmailConfirmation: boolean }>({
    schema: registerSchema as never,
    action,
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
    redirectTo: "/",
  });

  return (
    <form onSubmit={onSubmit} noValidate>
      <Input {...register("name")} label="Name" id="name" error={errors.name?.message ?? null} />
      <Input {...register("email")} label="Email" id="email" error={errors.email?.message ?? null} />
      <PasswordInput
        {...register("password")}
        label="Password"
        id="password"
        error={errors.password?.message ?? null}
      />
      <PasswordInput
        {...register("confirmPassword")}
        label="Confirm Password"
        id="confirm-password"
        error={errors.confirmPassword?.message ?? null}
      />
      {errors.root && <p role="alert">{errors.root.message}</p>}
      <Button isLoading={isSubmitting}>Register</Button>
    </form>
  );
}

const okAction = vi.fn(async () => ({
  success: true as const,
  data: { needsEmailConfirmation: false },
}));

beforeEach(() => {
  refresh.mockReset();
  push.mockReset();
  toastError.mockReset();
  toastSuccess.mockReset();
  okAction.mockClear();
});

describe("useAuthForm", () => {
  it("shows every field error at once on an invalid submit", async () => {
    // Invariant guard for a failure seen in Chrome, where a submit surfaced
    // only one message. jsdom does not reproduce that focus/blur ordering, so
    // this asserts the contract rather than the original repro; locking the
    // browser behaviour itself needs an end-to-end test.
    const user = userEvent.setup();
    render(<TestForm action={okAction} />);

    await user.type(screen.getByLabelText("Name"), "Te");
    await user.type(screen.getByLabelText("Password"), "abcdefgh");
    await user.type(screen.getByLabelText("Confirm Password"), "different1");
    await user.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText("Name must be at least 3 characters long")).toBeInTheDocument();
    });
    expect(screen.getByText("Email is required")).toBeInTheDocument();
    expect(
      screen.getByText("Password must contain at least one number"),
    ).toBeInTheDocument();
    expect(screen.getByText("Passwords didn't match")).toBeInTheDocument();

    expect(okAction).not.toHaveBeenCalled();
  });

  it("moves focus to the first invalid field", async () => {
    const user = userEvent.setup();
    render(<TestForm action={okAction} />);

    await user.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByLabelText("Name")).toHaveFocus();
    });
  });

  it("marks invalid fields for assistive technology", async () => {
    const user = userEvent.setup();
    render(<TestForm action={okAction} />);

    await user.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "true");
    });
    const describedBy = screen.getByLabelText("Email").getAttribute("aria-describedby");
    expect(describedBy).toContain("email-error");
  });

  it("refreshes the server tree before redirecting on success", async () => {
    const user = userEvent.setup();
    render(<TestForm action={okAction} />);

    await fillValid(user);
    await user.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => expect(okAction).toHaveBeenCalledTimes(1));
    // Without the refresh, Server Components keep rendering the signed-out tree.
    expect(refresh).toHaveBeenCalled();
    expect(push).toHaveBeenCalledWith("/");
  });

  it("surfaces a failed action as an inline alert and a toast", async () => {
    const failing = vi.fn(async () => ({
      success: false as const,
      error: "Invalid email or password.",
      code: "invalid_credentials",
    }));
    const user = userEvent.setup();
    render(<TestForm action={failing} />);

    await fillValid(user);
    await user.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Invalid email or password.");
    });
    expect(toastError).toHaveBeenCalledWith("Invalid email or password.");
    expect(push).not.toHaveBeenCalled();
  });

  it("recovers from a thrown action without leaking the error", async () => {
    const throwing = vi.fn(async () => {
      throw new Error("connect ECONNREFUSED 127.0.0.1:5432");
    });
    const user = userEvent.setup();
    render(<TestForm action={throwing as never} />);

    await fillValid(user);
    await user.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
    expect(screen.getByRole("alert")).not.toHaveTextContent("ECONNREFUSED");
  });
});

async function fillValid(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Name"), "Vlad");
  await user.type(screen.getByLabelText("Email"), "vlad@example.com");
  await user.type(screen.getByLabelText("Password"), "abcdefg1");
  await user.type(screen.getByLabelText("Confirm Password"), "abcdefg1");
}
