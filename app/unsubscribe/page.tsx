import type { Metadata } from "next";
import { getAdminClient } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Unsubscribe",
};

interface Props {
  searchParams: { token?: string };
}

export default async function UnsubscribePage({ searchParams }: Props) {
  const { token } = searchParams;

  if (!token) {
    return <Result heading="Invalid link" body="This unsubscribe link is missing or malformed. Please contact us if you need help removing your email address." />;
  }

  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("subscribers")
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq("unsubscribe_token", token)
    .is("unsubscribed_at", null)
    .select("id");

  if (error) {
    return <Result heading="Something went wrong" body="We couldn't process your request. Please try again or contact us directly." />;
  }

  if (!data || data.length === 0) {
    return <Result heading="Already unsubscribed" body="This email address has already been removed from our list." />;
  }

  return (
    <div className="max-w-md mx-auto px-4 py-32 text-center">
      <h1 className="font-serif text-2xl text-clay-800 mb-4">You&apos;re unsubscribed.</h1>
      <p className="text-stone-500 mb-6">
        Your email has been removed from our list. You won&apos;t hear from us again
        unless you sign up again.
      </p>
      <a
        href="/"
        className="text-clay-600 underline underline-offset-4 hover:text-clay-800 transition-colors text-sm"
      >
        Back to home
      </a>
    </div>
  );
}

function Result({ heading, body }: { heading: string; body: string }) {
  return (
    <div className="max-w-md mx-auto px-4 py-32 text-center">
      <h1 className="font-serif text-2xl text-clay-800 mb-4">{heading}</h1>
      <p className="text-stone-500 mb-6">{body}</p>
      <a
        href="/"
        className="text-clay-600 underline underline-offset-4 hover:text-clay-800 transition-colors text-sm"
      >
        Back to home
      </a>
    </div>
  );
}
