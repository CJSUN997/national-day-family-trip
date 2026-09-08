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
    description: "巴厘岛与曼谷＋普吉本岛并列比较，包含家庭偏好、逐日行程、预算和预订清单。",
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
      title: "向海而行 · 2026国庆家庭旅行决策册",
      description: "两条并列候选路线，一起选出最适合全家的国庆旅行。",
      type: "website",
      locale: "zh_CN",
      images: [{ url: imageUrl, width: 1736, height: 907, alt: "曼谷、普吉与巴厘岛家庭旅行拼贴" }],
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
