import type { Metadata } from "next";
import { Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const noto = Noto_Sans_KR({ subsets: ["latin"], variable: "--font-main" });
const notoSerif = Noto_Serif_KR({ subsets: ["latin"], variable: "--font-display" });

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3001";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const title = "AI유니패스 파트너 | 당신의 다음 길을 함께 찾는 생활금융 파트너";
  const description = "보험·상조 상담, 보험금 청구, 파트너 활동을 신뢰할 수 있는 하나의 흐름으로 연결하는 사람 중심 워크스페이스.";
  return {
    metadataBase: new URL(origin),
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "ko_KR",
      images: [{ url: `${origin}/og.png`, width: 1200, height: 630, alt: "AI유니패스 파트너 — 당신의 다음 길을 함께 찾습니다" }],
    },
    twitter: { card: "summary_large_image", title, description, images: [`${origin}/og.png`] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body className={`${noto.variable} ${notoSerif.variable}`}>{children}</body></html>;
}
