"use client";

import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: React.ReactNode;
  footer?: React.ReactNode;
  size?: ModalSize;
  closeOnOverlayClick?: boolean;
  hideCloseButton?: boolean;
  className?: string;
  overlayClassName?: string;
};

const sizeClasses: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-full mx-4",
};

export default function Modal({
  isOpen,
  onClose,
  children,
  title,
  footer,
  size = "md",
  closeOnOverlayClick = true,
  hideCloseButton = false,
  className = "",
  overlayClassName = "",
}: Props) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm ${overlayClassName}`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={contentRef}
        className={`relative w-full ${sizeClasses[size]} bg-white border border-white/10 rounded-2xl shadow-xl flex flex-col max-h-[90vh] ${className}`}
      >
        {(title || !hideCloseButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            {title ? (
              <h2 className="text-black font-semibold text-lg">{title}</h2>
            ) : (
              <span />
            )}
            {!hideCloseButton && (
              <button
                onClick={onClose}
                className="text-black/50 hover:text-black transition-colors cursor-pointer ml-auto"
                aria-label="Закрыть"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        )}

        <div className="overflow-y-auto flex-1 px-6 py-4">{children}</div>

        {footer && (
          <div className="px-6 py-4 border-t border-white/10">{footer}</div>
        )}
      </div>
    </div>,
    document.body,
  );
}
