"use client";
import React from "react";
import Image from "next/image";
import type { ProfileParams } from "@/shared/utils/profile/services/profile.service";
import {
  updateProfile,
  getProfile,
} from "@/shared/utils/profile/services/profile.service";

type Draft = {
  username: string;
  email: string;
  title: string;
  location: string;
  bio: string;
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
  const avatar = "";

  const [isEditing, setIsEditing] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [data, setData] = React.useState<Draft>({
    username: initialData?.username || authName,
    email: initialData?.email || authEmail,
    title: initialData?.skill ?? "",
    location: initialData?.location ?? "",
    bio: initialData?.description ?? "",
  });
  const [draft, setDraft] = React.useState<Draft>(data);

  function handleEdit() {
    setDraft(data);
    setIsEditing(true);
  }

  async function handleSave() {
    setIsSaving(true);
    await updateProfile(userId, {
      username: draft.username,
      email: draft.email,
      skill: draft.title,
      description: draft.bio,
      location: draft.location,
    });

    const fresh = await getProfile(userId);
    setData({
      username: fresh?.username || draft.username,
      email: fresh?.email || draft.email,
      title: fresh?.skill ?? draft.title,
      location: fresh?.location ?? draft.location,
      bio: fresh?.description ?? draft.bio,
    });
    setIsSaving(false);
    setIsEditing(false);
  }

  function handleCancel() {
    setIsEditing(false);
  }

  function set(field: keyof Draft) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setDraft((prev) => ({ ...prev, [field]: e.target.value }));
  }

  const inputCls =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition";

  return (
    <div className="border-b-2 border-slate-200">
      <div className="p-10 flex gap-10">
        <div className="shrink-0">
          {avatar ? (
            <Image
              src={avatar}
              alt="profile"
              width={300}
              height={300}
              className="w-[300px] h-[300px] rounded-full object-cover"
            />
          ) : (
            <div className="w-[300px] h-[300px] rounded-full bg-blue-500 flex items-center justify-center text-white text-7xl font-semibold select-none">
              {(data.username || "?").charAt(0).toUpperCase()}
            </div>
          )}
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
                  value={draft.username}
                  onChange={set("username")}
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
                  value={draft.email}
                  onChange={set("email")}
                  placeholder="email@example.com"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Title
                </label>
                <input
                  className={inputCls}
                  value={draft.title}
                  onChange={set("title")}
                  placeholder="e.g., Product Designer"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Location
                </label>
                <input
                  className={inputCls}
                  value={draft.location}
                  onChange={set("location")}
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
                  value={draft.bio}
                  onChange={set("bio")}
                  placeholder="Tell us about yourself..."
                />
              </div>
            </>
          ) : (
            <>
              <h2 className="text-5xl font-bold">{data.username || "—"}</h2>
              <p className="text-slate-500 text-lg">{data.email}</p>
              {data.title && (
                <p className="text-slate-500 text-[20px]">{data.title}</p>
              )}
              {data.location && (
                <p className="text-slate-400 text-[18px]">{data.location}</p>
              )}
              {data.bio && (
                <p className="mt-2 text-slate-500 max-w-2xl text-[18px]">
                  {data.bio}
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
              onClick={handleSave}
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
