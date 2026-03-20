"use client";
import React, { useState, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { skillSchema, type SkillFormData } from "../schemas/skill.schema";
import { uploadSkillImage } from "../services/skill.service";
import { createSkillAction } from "../actions";
import {
  SKILL_CATEGORIES,
  SKILL_CATEGORY_GROUPS,
} from "@/shared/constants/categories";
import {
  TEACHING_LANGUAGES,
  TEACHING_LANGUAGE_GROUPS,
} from "@/shared/constants/languages";

function SkillForm() {
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      proficiencyLevel: "beginner",
    },
  });
  const [selectedLevel, setSelectedLevel] = useState<
    "beginner" | "intermediate" | "advanced"
  >("beginner");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setValue("image", file, { shouldValidate: true });
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }
  const { ref: registerRef, ...rest } = register("image");

  const onSubmit = async (data: SkillFormData) => {
    try {
      const imagePath = await uploadSkillImage(data.image);
      if (!imagePath) {
        setError("image", { message: "Failed to upload image" });
        return;
      }

      const result = await createSkillAction({
        skillTitle: data.skillTitle,
        category: data.category,
        language: data.language,
        proficiencyLevel: data.proficiencyLevel,
        skillDescription: data.skillDescription,
        imagePath,
      });

      if (result.error) {
        setError("root", { message: result.error });
      }
    } catch (error) {
      console.error("Error creating skill:", error);
      setError("root", {
        message: "Failed to create skill. Please try again.",
      });
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-8 ">
      <div className="grid gap-2 mb-2">
        <label className="text-[#334155] font-bold text-sm" htmlFor="">
          Skill Title
        </label>
        <input
          {...register("skillTitle", { required: true })}
          className="border border-[#E2E8F0] px-4 py-3 rounded-[12px]"
          type="text"
          placeholder="e.g. Master React.js Development"
        />
      </div>
      <div className="flex gap-4 mt-8">
        <div className="grid gap-2 flex-1">
          <label
            className="text-[#334155] font-bold text-sm"
            htmlFor="category"
          >
            Category
          </label>
          <select
            {...register("category", { required: true })}
            className="border border-[#E2E8F0] px-4 py-3 rounded-[12px] w-full appearance-none"
            name="category"
            id="category"
            defaultValue=""
          >
            <option value="" disabled>
              Select Category
            </option>
            {SKILL_CATEGORY_GROUPS.map((group) => (
              <optgroup key={group} label={group}>
                {SKILL_CATEGORIES.filter((c) => c.group === group).map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <div className="grid gap-2 flex-1">
          <label
            className="text-[#334155] font-bold text-sm"
            htmlFor="language"
          >
            Teaching Language
          </label>
          <select
            {...register("language", { required: true })}
            className="border border-[#E2E8F0] px-4 py-3 rounded-[12px] w-full appearance-none"
            name="language"
            id="language"
            defaultValue="english"
          >
            {TEACHING_LANGUAGE_GROUPS.map((group) => (
              <optgroup key={group} label={group}>
                {TEACHING_LANGUAGES.filter((l) => l.group === group).map(
                  (l) => (
                    <option key={l.value} value={l.value}>
                      {l.label}
                    </option>
                  ),
                )}
              </optgroup>
            ))}
          </select>
        </div>
      </div>
      <div className="grid gap-2 mt-8">
        {" "}
        <label className="text-[#334155] font-bold text-sm" htmlFor="">
          Your Proficiency Level
        </label>
        <div className="bg-[#F1F5F9] border border-[#E2E8F0] p-1 rounded-[12px] flex gap-3">
          {(["beginner", "intermediate", "advanced"] as const).map((level) => (
            <div
              key={level}
              className="flex-1 items-center justify-center text-center cursor-pointer"
              onClick={() => {
                setSelectedLevel(level);
                setValue("proficiencyLevel", level);
              }}
            >
              <div
                className={`rounded-[12px] p-2 h-8 items-center justify-center flex ${
                  selectedLevel === level
                    ? "bg-[#2563EB]"
                    : "bg-white border border-[#E2E8F0] shadow-sm"
                }`}
              >
                {selectedLevel === level && (
                  <div className="bg-white rounded-full p-1.5 w-fit"></div>
                )}
              </div>
              <h4 className="text-[#64748B] text-[14px] mt-2 font-semibold capitalize">
                {level}
              </h4>
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-2 mt-8">
        {" "}
        <label className="text-[#334155] font-bold text-sm" htmlFor="">
          Skill Description
        </label>
        <textarea
          {...register("skillDescription", { required: true })}
          className="p-4 rounded-[12px] border border-[#E2E8F0]"
          placeholder="Describe what you can teach and what students can expect to learn..."
        ></textarea>
        <p className=" text-[#94A3B8]">Minimum 100 characters recommended.</p>
      </div>
      <div className="grid gap-2 mt-8">
        {" "}
        <label className="text-[#334155] font-bold text-sm" htmlFor="">
          Skill Representation
        </label>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[#CBD5E1] rounded-[12px] overflow-hidden bg-[#F8FAFC]/50 flex flex-col items-center justify-center cursor-pointer hover:bg-[#F1F5F9] transition min-h-[140px]"
        >
          {previewUrl ? (
            <div className="relative w-full h-full">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-48 object-cover rounded-[10px]"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition rounded-[10px]">
                <p className="text-white font-semibold text-sm">
                  Click to change
                </p>
              </div>
            </div>
          ) : (
            <>
              <svg
                width="27"
                height="35"
                viewBox="0 0 27 35"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 27C2.175 27 1.46875 26.7062 0.88125 26.1187C0.29375 25.5312 0 24.825 0 24V3C0 2.175 0.29375 1.46875 0.88125 0.88125C1.46875 0.29375 2.175 0 3 0H24C24.825 0 25.5312 0.29375 26.1187 0.88125C26.7062 1.46875 27 2.175 27 3V24C27 24.825 26.7062 25.5312 26.1187 26.1187C25.5312 26.7062 24.825 27 24 27H3ZM3 24H24V3H3V24ZM4.5 21H22.5L16.875 13.5L12.375 19.5L9 15L4.5 21ZM3 24V3V24Z"
                  fill="#94A3B8"
                />
              </svg>
              <p className="text-[#334155] font-bold text-[15px] mt-3">
                Click to upload or drag &amp; drop
              </p>
              <p className="text-[#94A3B8] text-[13px]">PNG, JPG up to 5MB</p>
            </>
          )}
          <input
            ref={(e) => {
              registerRef(e);
              fileInputRef.current = e;
            }}
            className="hidden"
            type="file"
            accept="image/png, image/jpeg"
            {...rest}
            onChange={handleFileChange}
          />
        </div>
      </div>
      {errors.root && (
        <p className="text-red-500 text-sm mt-4">{errors.root.message}</p>
      )}
      <div className="flex gap-2 mt-8">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#2563EB] cursor-pointer flex gap-2 items-center shadow-md rounded-[12px] px-5 py-3 text-white text-[16px] font-bold disabled:opacity-60"
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 17 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.5 12.5H9.16667V9.16667H12.5V7.5H9.16667V4.16667H7.5V7.5H4.16667V9.16667H7.5V12.5ZM8.33333 16.6667C7.18056 16.6667 6.09722 16.4479 5.08333 16.0104C4.06944 15.5729 3.1875 14.9792 2.4375 14.2292C1.6875 13.4792 1.09375 12.5972 0.65625 11.5833C0.21875 10.5694 0 9.48611 0 8.33333C0 7.18056 0.21875 6.09722 0.65625 5.08333C1.09375 4.06944 1.6875 3.1875 2.4375 2.4375C3.1875 1.6875 4.06944 1.09375 5.08333 0.65625C6.09722 0.21875 7.18056 0 8.33333 0C9.48611 0 10.5694 0.21875 11.5833 0.65625C12.5972 1.09375 13.4792 1.6875 14.2292 2.4375C14.9792 3.1875 15.5729 4.06944 16.0104 5.08333C16.4479 6.09722 16.6667 7.18056 16.6667 8.33333C16.6667 9.48611 16.4479 10.5694 16.0104 11.5833C15.5729 12.5972 14.9792 13.4792 14.2292 14.2292C13.4792 14.9792 12.5972 15.5729 11.5833 16.0104C10.5694 16.4479 9.48611 16.6667 8.33333 16.6667ZM8.33333 15C10.1944 15 11.7708 14.3542 13.0625 13.0625C14.3542 11.7708 15 10.1944 15 8.33333C15 6.47222 14.3542 4.89583 13.0625 3.60417C11.7708 2.3125 10.1944 1.66667 8.33333 1.66667C6.47222 1.66667 4.89583 2.3125 3.60417 3.60417C2.3125 4.89583 1.66667 6.47222 1.66667 8.33333C1.66667 10.1944 2.3125 11.7708 3.60417 13.0625C4.89583 14.3542 6.47222 15 8.33333 15Z"
              fill="white"
            />
          </svg>
          Create Skill
        </button>
        <button
          type="button"
          className="border cursor-pointer border-[#E2E8F0] rounded-[12px] px-5 py-3 text-[#475569] text-[16px] font-bold"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default SkillForm;
