import React from "react";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import db from "@/lib/supabase/db";
import { redirect } from "next/navigation";
import DashboardSetup from "@/components/dashboard-page/DashboardSetup";
import { getUserSubscriptionStatus } from "@/lib/supabase/queries";

const DashboardPage = async () => {
  const supbase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supbase.auth.getUser();

  if (!user) return;

  const workspace = await db.query.workspaces.findFirst({
    where: (workspace, { eq }) => eq(workspace.workspaceOwner, user.id),
  });

  const { data: subscription, error: subscriptionError } =
    await getUserSubscriptionStatus(user.id);

  if (subscriptionError) return;

  if (!workspace)
    return (
      <div className="bg-background h-screen w-screen text-white flex justify-center items-center">
        <DashboardSetup
          user={user}
          subscription={subscription}
        >
        </DashboardSetup>
      </div>
    );

  redirect(`/dashboard/${workspace.id}`);
};

export default DashboardPage;
