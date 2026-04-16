"use client";
import React from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { ProfileParams } from "@/entities";
import {
  updateProfile,
  uploadAvatarImage,
} from "@/features/profile/api/profile.service";
import useProfileStore from "@/features/profile/model/useProfileStore";

type FormValues = {
  avatar_url: string;
  username: string;
  email: string;

  location: string;
  description: string;
};

type Props = {
  userId: string;
  initialData: ProfileParams | null;
  authEmail?: string;
  authName?: string;
};

function UserInfo({
  userId,
  initialData,
  authEmail = "",
  authName = "",
}: Props) {
  const { setProfile } = useProfileStore();

  const [isEditing, setIsEditing] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, watch, setValue } =
    useForm<FormValues>({
      defaultValues: {
        avatar_url: "",

        location: "",
        description: "",
        ...(initialData ?? {}),
        username: initialData?.username || authName,
        email: initialData?.email || authEmail,
      },
    });

  const avatarUrl = watch("avatar_url");

  function handleEdit() {
    setIsEditing(true);
    setProfile({ isEditing: true });
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await uploadAvatarImage(file, userId);
      setValue("avatar_url", url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  }

  async function onSubmit(formData: FormValues) {
    setIsSaving(true);
    await updateProfile(userId, {
      username: formData.username,
      email: formData.email,

      description: formData.description,
      location: formData.location,
      avatar_url: formData.avatar_url,
    });
    reset(formData);
    setProfile({
      username: formData.username,
      avatar_url: formData.avatar_url,
      isEditing: false,
    });
    setIsSaving(false);
    setIsEditing(false);
  }

  function handleCancel() {
    reset();
    setIsEditing(false);
    setProfile({ isEditing: false });
  }

  const inputCls =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition";

  return (
    <div className="border-b-2 border-slate-200">
      <div className="p-10 flex gap-10">
        <div className="shrink-0 relative group">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt="profile"
              width={300}
              height={300}
              className="w-[300px] h-[300px] rounded-full object-cover"
            />
          ) : (
            <div className="w-[300px] h-[300px] rounded-full bg-blue-500 flex items-center justify-center text-white text-7xl font-semibold select-none">
              {(watch("username") || "?").charAt(0).toUpperCase()}
            </div>
          )}

          {isEditing && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="absolute inset-0 w-[300px] h-[300px] rounded-full flex flex-col items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity text-white gap-1 disabled:cursor-wait"
            >
              {isUploading ? (
                <span className="text-sm">Uploading...</span>
              ) : (
                <>
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
                  >
                    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                    <circle cx="12" cy="13" r="3" />
                  </svg>
                  <span className="text-xs font-medium">Change photo</span>
                </>
              )}
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>

        <div className="flex flex-col gap-3 w-full">
          {isEditing ? (
            <>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Name
                </label>
                <input
                  className={inputCls}
                  {...register("username")}
                  placeholder="Your name"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Email
                </label>
                <input
                  className={inputCls}
                  type="email"
                  {...register("email")}
                  placeholder="email@example.com"
                />
              </div>
              {/* <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Skill
                </label>
                <input
                  className={inputCls}
                  {...register("skill")}
                  placeholder="e.g., Product Designer"
                />
              </div> */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Location
                </label>
                <input
                  className={inputCls}
                  {...register("location")}
                  placeholder="e.g., Moscow"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  About
                </label>
                <textarea
                  className={`${inputCls} resize-none`}
                  rows={4}
                  {...register("description")}
                  placeholder="Tell us about yourself..."
                />
              </div>
            </>
          ) : (
            <>
              <h2 className="text-5xl font-bold">{watch("username") || "—"}</h2>
              <p className="text-slate-500 text-lg">{watch("email")}</p>

              {watch("location") && (
                <p className="text-slate-400 text-[18px]">
                  {watch("location")}
                </p>
              )}
              {watch("description") && (
                <p className="mt-2 text-slate-500 max-w-2xl text-[18px]">
                  {watch("description")}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6 ml-10">
        {isEditing ? (
          <>
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={isSaving}
              className="flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 active:bg-slate-100"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 active:bg-slate-100"
          >
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
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              <path d="m15 5 4 4" />
            </svg>
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}

export default UserInfo;
