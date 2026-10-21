import { Wordmark } from "@/components/wordmark";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="px-4 py-5 sm:px-6">
        <Wordmark />
      </header>
      <div className="flex flex-1 flex-col">
        {children}
      </div>
    </div>
  );
}
