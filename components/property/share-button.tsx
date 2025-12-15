"use client";

import { useState } from "react";
import { Share2, Link2, Check, X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareButtonProps {
  title: string;
  url?: string;
}

export default function ShareButton({ title, url }: ShareButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  const shareOptions = [
    {
      name: "Line",
      icon: MessageCircle,
      color: "bg-[#06C755] hover:bg-[#05b34c]",
      onClick: () => {
        window.open(
          `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`,
          "_blank",
          "width=600,height=400"
        );
      },
    },
    {
      name: "Facebook",
      icon: () => (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      color: "bg-[#1877F2] hover:bg-[#166fe5]",
      onClick: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
          "_blank",
          "width=600,height=400"
        );
      },
    },
  ];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowModal(true)}
        className="border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-[#C9A227] hover:border-[#C9A227]"
      >
        <Share2 className="w-4 h-4 mr-2" />
        แชร์
      </Button>

      {/* Share Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">แชร์ทรัพย์สิน</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Share Options */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {shareOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.name}
                    onClick={option.onClick}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-medium transition-all ${option.color}`}
                  >
                    <Icon />
                    {option.name}
                  </button>
                );
              })}
            </div>

            {/* Copy Link */}
            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm text-gray-500 mb-2">หรือคัดลอกลิงก์</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 truncate"
                />
                <button
                  onClick={copyLink}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    copied
                      ? "bg-green-500 text-white"
                      : "bg-[#C9A227] hover:bg-[#A88B1F] text-white"
                  }`}
                >
                  {copied ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Link2 className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
