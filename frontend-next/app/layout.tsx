import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google"; // Remove Geist imports
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Transformellica AI Marketing Analytics & BI Assistant",
  description: "AI-Powered Social Media & Website Analysis, TransformiX BI Assistant helps businesses unlock insights from CRM data. Upload your CSV files and get actionable business intelligence instantly.",
  icons: {
    icon: "/Logo.webp",    
    shortcut: "/Logo.webp", 
    apple: "/Logo.webp", 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="min-h-screen flex flex-col"
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
            <Header/>
              <div className="flex-grow">
                {children}
              </div>
            <Footer/>
        </AuthProvider>
      </body>
    </html>
  );
}
