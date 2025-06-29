import Form from "next/form";

import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function ResetPasswordForm({
  action,
  children,
}: {
  action: NonNullable<
    string | ((formData: FormData) => void | Promise<void>) | undefined
  >;
  children: React.ReactNode;
}) {
  return (
    <Form action={action} className="flex flex-col gap-4 px-4 w-full">
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="email"
          className="text-zinc-600 font-normal dark:text-zinc-400"
        >
          Email
        </Label>

        <Input
          id="email"
          name="email"
          className="bg-muted w-full text-md md:text-sm"
          type="email"
          required
        />
      </div>

      {children}
    </Form>
  );
}
