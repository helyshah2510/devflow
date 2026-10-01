type ErrorMessageProps = {
  message: string;
};

export default function ErrorMessage({
  message,
}: ErrorMessageProps) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
      <p className="font-medium">Access Denied</p>
      <p className="mt-1 text-sm">{message}</p>
    </div>
  );
}