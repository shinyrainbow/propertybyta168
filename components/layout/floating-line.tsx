"use client";

import { useState, useEffect } from "react";
import { X, MessageCircle } from "lucide-react";
import Image from "next/image";

export default function FloatingLine() {
  const [showQR, setShowQR] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show button after a short delay
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Floating LINE Button - Desktop only, mobile uses bottom nav */}
      <button
        onClick={() => setShowQR(true)}
        className={`fixed bottom-6 right-6 z-40 hidden md:flex items-center gap-2 bg-[#06C755] hover:bg-[#05b34c] text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <MessageCircle className="w-5 h-5" />
        <span className="font-medium">Line</span>
      </button>

      {/* Line QR Modal */}
      {showQR && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#06C755] rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  เพิ่มเพื่อนทาง Line
                </h3>
              </div>
              <button
                onClick={() => setShowQR(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="bg-[#06C755]/5 rounded-xl p-6 flex justify-center">
              <Image
                src="/qrcode.png"
                alt="Line QR Code"
                width={200}
                height={200}
                className="rounded-lg"
              />
            </div>
            <p className="text-center text-sm text-gray-500 mt-4">
              สแกน QR Code เพื่อเพิ่มเพื่อนทาง Line
            </p>
            <p className="text-center text-xs text-gray-400 mt-2">
              หรือค้นหา ID: @skypro
            </p>
          </div>
        </div>
      )}
    </>
  );
}
