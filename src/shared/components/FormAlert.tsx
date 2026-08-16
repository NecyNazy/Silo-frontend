export interface FormAlertProps {
  message?: string | null;
}

export function FormAlert({ message }: FormAlertProps) {
  if (!message) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
    >
      {message}
    </div>
  );
}
