// components/shared/PageLayout.tsx
import type { ReactNode } from "react";
import { Toaster } from "sonner";

interface PageLayoutProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export default function PageLayout({ title, children, className = "" }: PageLayoutProps) {
  return (
    <div className={`min-h-screen flex flex-col items-center bg-primary-ecoLight p-10 ${className}`}>
      <Toaster
        position="top-right"
        richColors
        expand={true}
        gap={12}
        offset={16}
        toastOptions={{
          style: { marginBottom: "12px" },
          className: "my-3",
        }}
      />
      <h2 className="text-3xl font-bold text-heading-dark mb-8">{title}</h2>
      {children}
    </div>
  );
}
