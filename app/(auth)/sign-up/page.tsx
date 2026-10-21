import { SignUpForm } from "@/components/sign-up-form";

export default function Page() {
  return (
    <div className="flex w-full flex-1 items-center justify-center p-6 pb-24 md:p-10 md:pb-28">
      <div className="w-full max-w-sm">
        <SignUpForm />
      </div>
    </div>
  );
}
