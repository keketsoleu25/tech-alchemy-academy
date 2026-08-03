"use client";

import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  idleText: string;
  pendingText: string;
  className: string;
};

export function SubmitButton({
  idleText,
  pendingText,
  className,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      aria-live="polite"
      className={`${className} disabled:cursor-wait disabled:opacity-70`}
    >
      <span className="inline-flex items-center justify-center gap-2">
        {pending && (
          <span
            aria-hidden="true"
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
          />
        )}
        {pending ? pendingText : idleText}
      </span>
    </button>
  );
}
