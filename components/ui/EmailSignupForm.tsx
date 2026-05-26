"use client";

import { useState } from "react";

export default function EmailSignupForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <p className="text-clay-700 text-sm">
        You&apos;re on the list! We&apos;ll be in touch when the next drop goes live.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        disabled={status === "loading"}
        className="flex-1 border border-clay-300 rounded-sm px-4 py-2
                   focus:outline-none focus:ring-2 focus:ring-clay-400 bg-white
                   disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-clay-600 text-white px-6 py-2 rounded-sm
                   hover:bg-clay-700 transition-colors text-sm tracking-widest uppercase
                   disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "loading" ? "..." : "Notify Me"}
      </button>
      {status === "error" && (
        <p className="w-full text-center text-sm text-red-500 mt-1">{message}</p>
      )}
    </form>
  );
}
