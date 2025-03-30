"use client";

import { HeroUIProvider } from "@heroui/react";
import { ClerkProvider } from "@clerk/nextjs";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <ClerkProvider>{children}</ClerkProvider>
    </HeroUIProvider>
  );
}
