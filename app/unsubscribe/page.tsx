// One-click unsubscribe page
// The token in the URL is validated server-side, then the subscriber record
// is soft-deleted (unsubscribed_at is set). No login required.

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unsubscribe",
};

interface Props {
  searchParams: { token?: string };
}

export default async function UnsubscribePage({ searchParams }: Props) {
  const { token } = searchParams;

  // TODO (Phase 3): call /api/unsubscribe with the token server-side
  // and show success or error state based on the result.

  if (!token) {
    return (
      <div className="max-w-md mx-auto px-4 py-32 text-center">
        <h1 className="text-2xl text-clay-800 mb-4">Invalid link</h1>
        <p className="text-stone-500">
          This unsubscribe link is missing or malformed. Please contact us if
          you need help removing your email address.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-32 text-center">
      <h1 className="text-2xl text-clay-800 mb-4">You&apos;re unsubscribed.</h1>
      <p className="text-stone-500 mb-6">
        Your email has been removed from our list. You won&apos;t hear from us again
        unless you sign up again.
      </p>
      <a
        href="/"
        className="text-clay-600 underline underline-offset-4 hover:text-clay-800
                   transition-colors text-sm"
      >
        Back to home
      </a>
    </div>
  );
}
