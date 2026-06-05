import Navbar from "@/components/protected/navbar";
import NavbarSkeleton from "@/components/protected/navbar-skeleton";
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";

async function ConditionalNavbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;
  return <Navbar />;
}

export default function RoomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={<NavbarSkeleton />}>
        <ConditionalNavbar />
      </Suspense>
      <div className="flex flex-row w-full flex-1">
        {children}
      </div>
    </>
  );
}
