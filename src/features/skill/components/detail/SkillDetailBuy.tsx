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
      <RequestModal
        profileUsername={profileUsername}
        skill={skill}
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      />
    </aside>
  );
}
type RequestModalProps = {
  skill: Skill | null;
  isOpen: boolean;
  onClose: () => void;
  profileUsername: string | null;
};

export function RequestModal({
  isOpen,
  onClose,
  skill,
  profileUsername,
}: RequestModalProps) {
  return (
    <Modal
      size="lg"
      title="Request Skill Exchange"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="flex items-center justify-between rounded-lg border border-[#C1C6D5] bg-[#EFF4FF] p-4">
        <div className=" flex items-center gap-3">
          <DevIcon />
          <div className="grid">
            <h4 className="text-[14px] text-[#0B1C30] font-semibold">
              {skill?.skill_title}
            </h4>
            <p className="text-[12px] text-[#414753] font-medium">
              {" "}
              with {profileUsername}
            </p>
          </div>
        </div>
        <div className="grid">
          <h4 className="text-[12px] text-[#0B1C30] font-medium text-right">
            Value
          </h4>
          <p className="text-[14px] text-[#005BAF] font-semibold whitespace-nowrap">
            {skill?.skill_price} credits/hour
          </p>
        </div>
      </div>
      <div className="py-6 grid">
        <h3 className="pb-2 text-[14px] text-[#0B1C30] font-semibold">
          Message to teacher!
        </h3>
        <textarea
          className="border border-[#C1C6D5]  rounded-lg p-4"
          placeholder={`Hi ${profileUsername}! I'm interested in learning about ${skill?.skill_title}...`}
        ></textarea>
        <p className="pt-2 text-[12px] text-[#414753] font-medium text-right">
          0/500 characters
        </p>
      </div>
      <div className="flex items-center justify-between rounded-lg border border-[#C1C6D5] bg-[#EFF4FF] p-4">
        <div className="flex items-center gap-2">
          <WalletIcon />
          <p className="text-[14px] text-[#0B1C30] font-semibold">
            Current Balance
          </p>
        </div>
        <h3 className="font-semibold text-[#005EB5] text-2xl">12.5 credits</h3>
      </div>
      <div className="py-6 gap-2 flex  ">
        <button
          onClick={onClose}
          className="border border-[#005BAF] rounded-full px-6 py-2.5 cursor-pointer"
        >
          <p className="font-semibold text-[#005BAF] text-[14px] ">Cancel</p>
        </button>
        <button className="border border-[#005BAF] rounded-full cursor-pointer px-6 py-2.5 bg-[#137FEC] shadow-lg">
          <p className="font-semibold text-white text-[14px] ">Send Request</p>
        </button>
      </div>
    </Modal>
  );
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

function DevIcon() {
  return (
    <div className="px-3 py-4 rounded-[4px] bg-[#0074DB]/10 w-fit">
      {" "}
      <svg
        width="20"
        height="12"
        viewBox="0 0 20 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6 12L0 6L6 0L7.425 1.425L2.825 6.025L7.4 10.6L6 12V12M14 12L12.575 10.575L17.175 5.975L12.6 1.4L14 0L20 6L14 12V12"
          fill="#005BAF"
        />
      </svg>
    </div>
  );
}

function WalletIcon() {
  return (
    <svg
      width="19"
      height="18"
      viewBox="0 0 19 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 16V16V16V16V16V16V16V16V2V2V2V2V2V2V2V2C2 2 2 2.37083 2 3.1125C2 3.85417 2 4.81667 2 6V12C2 13.1833 2 14.1458 2 14.8875C2 15.6292 2 16 2 16V16M2 18C1.45 18 0.979167 17.8042 0.5875 17.4125C0.195833 17.0208 0 16.55 0 16V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H16C16.55 0 17.0208 0.195833 17.4125 0.5875C17.8042 0.979167 18 1.45 18 2V4.5H16V2V2V2H2V2V2V16V16V16H16V16V16V13.5H18V16C18 16.55 17.8042 17.0208 17.4125 17.4125C17.0208 17.8042 16.55 18 16 18H2V18M10 14C9.45 14 8.97917 13.8042 8.5875 13.4125C8.19583 13.0208 8 12.55 8 12V6C8 5.45 8.19583 4.97917 8.5875 4.5875C8.97917 4.19583 9.45 4 10 4H17C17.55 4 18.0208 4.19583 18.4125 4.5875C18.8042 4.97917 19 5.45 19 6V12C19 12.55 18.8042 13.0208 18.4125 13.4125C18.0208 13.8042 17.55 14 17 14H10V14M17 12V12V12V6V6V6H10V6V6V12V12V12H17V12M13 10.5C13.4167 10.5 13.7708 10.3542 14.0625 10.0625C14.3542 9.77083 14.5 9.41667 14.5 9C14.5 8.58333 14.3542 8.22917 14.0625 7.9375C13.7708 7.64583 13.4167 7.5 13 7.5C12.5833 7.5 12.2292 7.64583 11.9375 7.9375C11.6458 8.22917 11.5 8.58333 11.5 9C11.5 9.41667 11.6458 9.77083 11.9375 10.0625C12.2292 10.3542 12.5833 10.5 13 10.5V10.5"
        fill="#005EB5"
      />
    </svg>
  );
}
