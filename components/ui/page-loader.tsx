import { Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageLoader({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex w-full flex-1 items-center justify-center p-12",
        className,
      )}
    >
      <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}
