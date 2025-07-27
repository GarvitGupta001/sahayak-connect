import type { Metadata } from "next";
import { UserProvider } from "@/context/UserContext";
import "./globals.css";
export const metadata: Metadata = {
  title: "Sahayak Connect",
  description: "Multilingual AI Agent for Welfare Access & Document Assistance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
