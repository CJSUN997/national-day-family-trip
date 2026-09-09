import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const imageUrl = `${protocol}://${host}/og.png`;
  return {
    title: "向海而行 · 2026国庆家庭旅行决策册",
    description: "2026国庆曼谷＋普吉本岛家庭旅行固定方案，包含家庭偏好、逐日行程、预算和预订清单。",
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
      title: "向海而行 · 2026国庆家庭旅行决策册",
      description: "曼谷3晚＋普吉4晚，一家四口的2026国庆旅行执行方案。",
      type: "website",
      locale: "zh_CN",
      images: [{ url: imageUrl, width: 1736, height: 907, alt: "曼谷与普吉家庭旅行拼贴" }],
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
