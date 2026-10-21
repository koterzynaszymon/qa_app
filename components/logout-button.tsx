"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LogOutIcon } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <Button variant="ghost" onClick={logout}>
      <LogOutIcon className="w-4 h-4" />
      <span className="hidden sm:inline">Log out</span>
      <span className="sr-only sm:hidden">Log out</span>
    </Button>
  );
}
