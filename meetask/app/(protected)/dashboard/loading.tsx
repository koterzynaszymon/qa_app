import { Loader2Icon } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center p-12">
      <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}
