"use client";

import React, { useState } from "react";
import { Skill } from "@/entities/skill/model";
import { Modal } from "@/shared/ui";

type Props = {
  skill: Skill | null;
  profileUsername: string | null;
};

export default function SkillDetailBuy({ skill, profileUsername }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside className="rounded-[16px] p-8 bg-white shadow-md w-full">
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-[#94A3B8] text-sm font-semibold tracking-wider">
            EXCHANGE VALUE
          </p>
          <div className="flex items-end gap-3 mt-3">
            <h2 className="text-[#137FEC] text-5xl font-extrabold">
              {skill?.skill_price}
            </h2>
            <p className="text-[#475569] text-lg">Credits / hour</p>
          </div>
        </div>

        <div>
          <button
            onClick={() => setIsOpen(true)}
            className="w-full flex items-center justify-center bg-[#137FEC] hover:bg-[#0f6fe6] text-white font-bold py-4 rounded-[12px] shadow-[0_10px_20px_rgba(19,127,236,0.2)] transition-colors cursor-pointer"
            type="button"
          >
            <ExchangeIcon />
            <span className="text-lg">Request Exchange</span>
          </button>
          <p className="text-[#94A3B8] text-sm text-center mt-4">
            {profileUsername} usually responds within 2 hours
          </p>
        </div>
      </div>
    </aside>
  );
}
type RequestModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function RequestModal({ isOpen, onClose }: RequestModalProps) {
  <Modal isOpen={isOpen} onClose={onClose}>
    <div>
      <div>
        <h2>Request Skill Exchange</h2>
        <CrossIcon />
      </div>
    </div>
  </Modal>;
}
function ExchangeIcon() {
  return (
    <svg
      width="24"
      height="16"
      viewBox="0 0 24 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 15.75C4.26667 15.3 2.83333 14.3667 1.7 12.95C0.566667 11.5333 0 9.88333 0 8C0 6.11667 0.566667 4.46667 1.7 3.05C2.83333 1.63333 4.26667 0.7 6 0.25V2.35C4.81667 2.75 3.85417 3.46667 3.1125 4.5C2.37083 5.53333 2 6.7 2 8C2 9.3 2.37083 10.4667 3.1125 11.5C3.85417 12.5333 4.81667 13.25 6 13.65V15.75ZM14 16C11.7833 16 9.89583 15.2208 8.3375 13.6625C6.77917 12.1042 6 10.2167 6 8C6 5.78333 6.77917 3.89583 8.3375 2.3375C9.89583 0.779167 11.7833 0 14 0C15.1 0 16.1333 0.208333 17.1 0.625C18.0667 1.04167 18.9167 1.61667 19.65 2.35L18.25 3.75C17.7 3.2 17.0625 2.77083 16.3375 2.4625C15.6125 2.15417 14.8333 2 14 2C12.3333 2 10.9167 2.58333 9.75 3.75C8.58333 4.91667 8 6.33333 8 8C8 9.66667 8.58333 11.0833 9.75 12.25C10.9167 13.4167 12.3333 14 14 14C14.8333 14 15.6125 13.8458 16.3375 13.5375C17.0625 13.2292 17.7 12.8 18.25 12.25L19.65 13.65C18.9167 14.3833 18.0667 14.9583 17.1 15.375C16.1333 15.7917 15.1 16 14 16ZM20 12L18.6 10.6L20.2 9H13V7H20.2L18.6 5.4L20 4L24 8L20 12Z"
        fill="white"
      />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.4 14L0 12.6L5.6 7L0 1.4L1.4 0L7 5.6L12.6 0L14 1.4L8.4 7L14 12.6L12.6 14L7 8.4L1.4 14V14"
        fill="#414753"
      />
    </svg>
  );
}
