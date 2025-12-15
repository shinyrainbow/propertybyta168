"use client";

import { useEffect, useState, useCallback, createContext, useContext, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

interface ConfirmDialogContextType {
  confirm: (options: ConfirmDialogOptions) => Promise<boolean>;
}

const ConfirmDialogContext = createContext<ConfirmDialogContextType | null>(null);

export function useConfirmDialog() {
  const context = useContext(ConfirmDialogContext);
  if (!context) {
    throw new Error("useConfirmDialog must be used within a ConfirmDialogProvider");
  }
  return context;
}

interface ConfirmDialogProviderProps {
  children: ReactNode;
}

export function ConfirmDialogProvider({ children }: ConfirmDialogProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmDialogOptions | null>(null);
  const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null);

  const confirm = useCallback((opts: ConfirmDialogOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setOptions(opts);
      setIsOpen(true);
      setResolvePromise(() => resolve);
    });
  }, []);

  const handleConfirm = () => {
    setIsOpen(false);
    resolvePromise?.(true);
  };

  const handleCancel = () => {
    setIsOpen(false);
    resolvePromise?.(false);
  };

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const getVariantStyles = () => {
    switch (options?.variant) {
      case "danger":
        return {
          icon: "bg-red-100 text-red-600",
          button: "bg-red-600 hover:bg-red-700",
        };
      case "warning":
        return {
          icon: "bg-yellow-100 text-yellow-600",
          button: "bg-yellow-600 hover:bg-yellow-700",
        };
      default:
        return {
          icon: "bg-[#C9A227]/20 text-[#C9A227]",
          button: "bg-[#C9A227] hover:bg-[#A88B1F]",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <ConfirmDialogContext.Provider value={{ confirm }}>
      {children}

      {/* Dialog Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <Card className="w-full max-w-md p-6 bg-white animate-in fade-in zoom-in duration-200">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${styles.icon}`}>
                <AlertTriangle className="w-5 h-5" />
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {options?.title || "ยืนยันการดำเนินการ"}
                </h3>
                <p className="text-gray-600 text-sm">
                  {options?.message}
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={handleCancel}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6 justify-end">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="text-gray-900"
              >
                {options?.cancelText || "ยกเลิก"}
              </Button>
              <Button
                onClick={handleConfirm}
                className={`text-white ${styles.button}`}
              >
                {options?.confirmText || "ยืนยัน"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </ConfirmDialogContext.Provider>
  );
}
