"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";

interface NameEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

export default function NameEntryModal({ isOpen, onClose, onSubmit, isLoading, error }: NameEntryModalProps) {
  const [name, setName] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted || !isOpen) return null;

  const handleSubmit = () => {
    if (name.trim() && !isLoading) {
      onSubmit(name.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 relative">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-zinc-200 touch-manipulation"
            aria-label="Go back"
            disabled={isLoading}
          >
            <ArrowLeft className="w-5 h-5 text-zinc-700" />
          </button>
        </div>

        <h2 className="text-xl font-bold text-zinc-900 text-center mb-2">Enter your name</h2>
        <p className="text-zinc-500 text-center mb-6">
          {"We'll use your name to identify your order"}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm text-center">
            {error}
          </div>
        )}

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none text-lg text-zinc-900 placeholder-zinc-400"
          autoFocus
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          disabled={isLoading}
        />

        <button
          onClick={handleSubmit}
          disabled={!name.trim() || isLoading}
          className="w-full mt-4 bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-300 disabled:cursor-not-allowed text-black font-bold py-3 px-6 rounded-xl text-lg touch-manipulation transition-colors flex items-center justify-center gap-2"
          aria-label="Proceed to payment"
        >
          <span>Proceed</span>
          <ChevronRight className="w-5 h-5" />
        </button>

        {isLoading && (
          <div className="mt-4 text-center text-zinc-500 text-sm">
            Placing your order...
          </div>
        )}
      </div>
    </div>
  );
}