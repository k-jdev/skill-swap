"use client";
import React, { useState, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { skillSchema, type SkillFormData } from "../../schemas/skill.schema";
import { uploadSkillImage } from "../../api/skill.service";
import { createSkillAction } from "../../actions";
import {
  SKILL_CATEGORIES,
  SKILL_CATEGORY_GROUPS,
} from "@/shared/constants/categories";
import {
  TEACHING_LANGUAGES,
  TEACHING_LANGUAGE_GROUPS,
} from "@/shared/constants/languages";
import { toast } from "sonner";
import { ImageIcon, PlusIcon } from "./icons/Icons";

function SkillForm() {
  const {
    register,
    handleSubmit,
    setValue,

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
        toast.error("Failed to upload image");

        return;
      }

      const result = await createSkillAction({
        skillTitle: data.skillTitle,
        skillPrice: data.skillPrice,
        category: data.category,
        language: data.language,
        proficiencyLevel: data.proficiencyLevel,
        skillDescription: data.skillDescription,
        imagePath,
      });

      if (!result.success) {
        toast.error(result.error);
      } else {
        toast.success("Skill created!");
      }
    } catch (error) {
      console.error("Error creating skill:", error);
      toast.error("Failed to create skill. Please try again.");
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
        <label className="text-[#334155] font-bold text-sm" htmlFor="">
          Price
        </label>
        <input
          {...register("skillPrice", { required: true })}
          className="border border-[#E2E8F0] px-4 py-3 rounded-[12px]"
          type="text"
          placeholder="Price of credits per hour"
        />
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
              <ImageIcon />
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
          <PlusIcon />
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
