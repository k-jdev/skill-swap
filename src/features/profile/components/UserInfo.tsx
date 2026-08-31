"use client";

import React from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as z from "zod";
import { ProfileParams } from "@/entities";
import { updateProfileAction, uploadAvatarAction } from "@/features/profile/actions";
import useProfileStore from "@/features/profile/model/useProfileStore";
import { emailSchema } from "@/features/auth/schemas";

const formSchema = z.object({
  avatar_url: z.string().default(""),
  username: z.string().trim().min(3, "Name must be at least 3 characters long"),
  email: emailSchema,
  location: z.string().trim().max(120).default(""),
  description: z.string().trim().max(1000).default(""),
});

type FormValues = z.input<typeof formSchema>;

type Props = {
  profileId: string;
  initialData: ProfileParams | null;
  authEmail?: string;
  authName?: string;
  readOnly?: boolean;
};

function UserInfo({
  initialData,
  authEmail = "",
  authName = "",
  readOnly = false,
}: Props) {
  const setProfile = useProfileStore((state) => state.setProfile);
  const router = useRouter();
  const [isEditing, setIsEditing] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const defaults: FormValues = {
    avatar_url: initialData?.avatar_url ?? "",
    location: initialData?.location ?? "",
    description: initialData?.description ?? "",
    username: initialData?.username || authName,
    email: initialData?.email || authEmail,
  };

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaults,
  });

  const avatarUrl = watch("avatar_url");

  function handleEdit() {
    setIsEditing(true);
    setProfile({ isEditing: true });
  }

  async function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadAvatarAction(formData);
    setIsUploading(false);
    event.target.value = "";

    if (!result.success) {
      toast.error(result.error);
      return;
    }
    setValue("avatar_url", result.data.url, { shouldDirty: true });
  }

  async function onSubmit(formData: FormValues) {
    const result = await updateProfileAction(formData);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    reset(formData);
    setProfile({
      username: formData.username,
      avatar_url: formData.avatar_url ?? "",
      isEditing: false,
    });
    setIsEditing(false);
    toast.success("Profile updated");
    // Server data is the source of truth for the nav avatar and the session.
    router.refresh();
  }

  function handleCancel() {
    reset(defaults);
    setIsEditing(false);
    setProfile({ isEditing: false });
  }

  const inputCls =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

  return (
    <div className="border-b-2 border-slate-200">
      <div className="flex flex-col gap-8 p-6 sm:p-10 md:flex-row md:gap-10">
        <div className="group relative mx-auto shrink-0 md:mx-0">
          <div className="h-[180px] w-[180px] sm:h-[240px] sm:w-[240px] lg:h-[300px] lg:w-[300px]">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={`${watch("username") || "User"} avatar`}
                width={300}
                height={300}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full select-none items-center justify-center rounded-full bg-primary text-7xl font-semibold text-white">
                {(watch("username") || "?").charAt(0).toUpperCase()}
              </div>
            )}

            {isEditing && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-1 rounded-full bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 disabled:cursor-wait"
              >
                {isUploading ? (
                  <span className="text-sm">Uploading...</span>
                ) : (
                  <>
                    <CameraIcon />
                    <span className="text-xs font-medium">Change photo</span>
                  </>
                )}
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>

        <div className="flex w-full flex-col gap-3">
          {isEditing ? (
            <>
              <Field label="Name" error={errors.username?.message}>
                <input
                  className={inputCls}
                  {...register("username")}
                  placeholder="Your name"
                  autoComplete="name"
                />
              </Field>
              <Field label="Email" error={errors.email?.message}>
                <input
                  className={inputCls}
                  type="email"
                  {...register("email")}
                  placeholder="email@example.com"
                  autoComplete="email"
                />
              </Field>
              <Field label="Location" error={errors.location?.message}>
                <input
                  className={inputCls}
                  {...register("location")}
                  placeholder="e.g., Moscow"
                  autoComplete="address-level2"
                />
              </Field>
              <Field label="About" error={errors.description?.message}>
                <textarea
                  className={`${inputCls} resize-none`}
                  rows={4}
                  {...register("description")}
                  placeholder="Tell us about yourself..."
                />
              </Field>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold sm:text-5xl">
                {watch("username") || "—"}
              </h2>
              <p className="text-lg text-slate-600">{watch("email")}</p>

              {watch("location") && (
                <p className="text-[18px] text-slate-500">{watch("location")}</p>
              )}
              {watch("description") && (
                <p className="mt-2 max-w-2xl text-[18px] text-slate-600">
                  {watch("description")}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      <div className="mb-6 ml-6 flex items-center gap-3 sm:ml-10">
        {isEditing ? (
          <>
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="flex cursor-pointer items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleCancel}
              className="flex cursor-pointer items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Cancel
            </button>
          </>
        ) : !readOnly ? (
          <button
            onClick={handleEdit}
            className="flex cursor-pointer items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            <PencilIcon />
            Edit Profile
          </button>
        ) : null}
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function CameraIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}

export default UserInfo;
