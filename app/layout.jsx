import "../src/index.css";
import Providers from "./providers";
import { MEDIA } from "@/lib/media";

const description =
  "Standard and High Cube containers in 10ft, 20ft and 40ft, plus Open Side containers in 20ft and 40ft, from HJ Container ApS.";

export const metadata = {
  title: {
    default: "HJ Container ApS",
    template: "%s | HJ Container ApS",
  },
  description,
  openGraph: {
    type: "website",
    siteName: "HJ Container ApS",
    title: "HJ Container ApS",
    description,
    images: [MEDIA.hero],
  },
  twitter: {
    card: "summary_large_image",
    title: "HJ Container ApS",
    description,
    images: [MEDIA.hero],
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
