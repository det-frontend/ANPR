import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { DashboardProvider } from "@/contexts/DashboardContext";
import SidebarWrapper from "../components/SidebarWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ANPR System",
  description: "Automatic Number Plate Recognition System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full m-0" suppressHydrationWarning={true}>
        <AuthProvider>
          <DashboardProvider>
            <SidebarWrapper>{children}</SidebarWrapper>
          </DashboardProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
