import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import SupabaseAuthProvider from "@/lib/contexts/SupabaseAuthProvider";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Tool Maker",
};

// do not cache this layout
export const revalidate = 0;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const accessToken = session?.access_token || null;

  return (
    <html lang="en">
      <body className={inter.className}>
        <SupabaseAuthProvider accessToken={accessToken}>
          {children}
        </SupabaseAuthProvider>

        <Toaster />
      </body>
    </html>
  );
}
