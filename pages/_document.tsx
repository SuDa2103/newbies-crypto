import { Head, Html, Main, NextScript } from "next/document";
import { BRAND_FONT_URL } from "../utils/constants";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preload" href={BRAND_FONT_URL} as="style" />
        <link rel="stylesheet" href={BRAND_FONT_URL} />
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GTAG}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GTAG}', { page_path: window.location.pathname });
            `
          }}
        />
        {/* turn off automatic (and aggressive) prism higlighting -- https://prismjs.com/#basic-usage */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.Prism = window.Prism || {};
              window.Prism.manual = true;
            `
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
