"use client";

type Props = {
  message?: string;
  onRetry?: () => void;
};

export default function ErrorState({
  message = "Something went wrong",
  onRetry,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <h2 className="text-2xl font-bold text-red-600">
        {message}
      </h2>

      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      )}
    </div>
  );
}