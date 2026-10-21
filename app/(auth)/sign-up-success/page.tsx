import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Page() {
  return (
    <div className="flex w-full flex-1 items-center justify-center p-6 pb-24 md:p-10 md:pb-28">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl tracking-tight">
                Check your email
              </CardTitle>
              <CardDescription>One step left before your first room</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                We sent you a confirmation link. Open it, then log in to
                create a room.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
