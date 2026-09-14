import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const imageUrl = `${protocol}://${host}/og.png`;
  return {
    title: "向南，再向北 · 2026国庆家庭旅行执行册",
    description: "2026国庆普吉3晚＋曼谷3晚家庭旅行方案，包含逐日安排、航班约束、预算与执行清单。",
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
      title: "向南，再向北 · 2026国庆家庭旅行执行册",
      description: "普吉3晚＋曼谷3晚，一家四口的2026国庆旅行执行方案。",
      type: "website",
      locale: "zh_CN",
      images: [{ url: imageUrl, width: 1736, height: 907, alt: "普吉与曼谷家庭旅行执行册" }],
    },
    twitter: { card: "summary_large_image", images: [imageUrl] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
