import type { Metadata } from "next";
import "./globals.css";
import {
  ClerkProvider,
  SignedIn,
  SignUpButton,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Providers } from "./provider";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Finance Tracker App",
  description: "Generated by dabs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <Providers>
        <html lang="en">
          <body className="bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-500">
            <div className="flex justify-end p-4 mr-4">
              <SignedOut>
                <SignUpButton mode="modal" />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
            <Toaster />
            {children}
          </body>
        </html>
      </Providers>
    </ClerkProvider>
  );
}
