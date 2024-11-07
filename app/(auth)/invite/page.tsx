import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { InviteForm } from "@/components/auth/invite-form";

export const metadata: Metadata = {
  title: "Accept Invitation | Data Management App",
  description: "Accept your invitation and create an account",
};

export default async function InvitePage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const supabase = createServerComponentClient({ cookies });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/dashboard");
  }

  if (!searchParams.token) {
    redirect("/login");
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome to the team
          </h1>
          <p className="text-sm text-muted-foreground">
            Complete your account setup to get started
          </p>
        </div>
        <InviteForm token={searchParams.token} />
      </div>
    </div>
  );
}