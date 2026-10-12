import React from "react";

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-card p-4">
      <div className="w-full max-w-xl bg-background rounded-2xl shadow-sm border border-border p-8">
        {children}
      </div>
    </div>
  );
}
