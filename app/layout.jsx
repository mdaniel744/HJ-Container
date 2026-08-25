import "../src/index.css";
import Script from "next/script";
import Providers from "./providers";

const description =
  "Standard and High Cube containers in 10ft, 20ft and 40ft, plus Open Side containers in 20ft and 40ft, from HJ Container ApS.";

export const metadata = {
  title: {
    default: "HJ Container ApS",
    template: "%s | HJ Container ApS",
  },
  description,
  icons: {
    icon: "https://base44.com/logo_v2.svg",
  },
  openGraph: {
    type: "website",
    siteName: "HJ Container ApS",
    title: "HJ Container ApS",
    description,
    images: [
      "https://media.base44.com/images/public/6a6b64082a3e26226bfba099/f109a3bb1_generated_51cf72e0.png",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HJ Container ApS",
    description,
    images: [
      "https://media.base44.com/images/public/6a6b64082a3e26226bfba099/f109a3bb1_generated_51cf72e0.png",
    ],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="da-DK">
      <body>
        {process.env.NODE_ENV === "development" ? (
          <Script id="base44-anonymous-analytics" strategy="beforeInteractive">
            {`
              try {
                const hasBase44Session =
                  window.localStorage.getItem("base44_access_token") ||
                  window.localStorage.getItem("token");

                if (!hasBase44Session) {
                  const url = new URL(window.location.href);
                  url.searchParams.set("analytics-enable", "false");
                  window.history.replaceState(
                    {},
                    document.title,
                    url.pathname + url.search + url.hash
                  );
                }
              } catch {}
            `}
          </Script>
        ) : null}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
