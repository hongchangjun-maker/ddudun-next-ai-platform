import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const noto = Noto_Sans_KR({ subsets: ["latin"], variable: "--font-main" });

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3001";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const title = "AI유니패스 파트너 | 상담과 활동을 잇는 AI 워크스페이스";
  const description = "보험·상조 상담, 보험금 청구, 파트너 활동을 하나의 흐름으로 연결하는 사람 중심 AI 플랫폼.";
  return {
    metadataBase: new URL(origin),
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "ko_KR",
      images: [{ url: `${origin}/og-ai-unipass-partner-social.png`, width: 1200, height: 630, alt: "AI유니패스 파트너 서비스 소개" }],
    },
    twitter: { card: "summary_large_image", title, description, images: [`${origin}/og-ai-unipass-partner-social.png`] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body className={noto.variable}>{children}</body></html>;
}
