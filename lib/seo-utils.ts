import { OpenGraph } from "next-seo/lib/types";

export const SHARED_SEO = {
  og: {
    type: "website",
    images: [
      {
        url: process.env.NEXT_PUBLIC_MAIN_OG_IMAGE,
        width: 1200,
        height: 630
      }
    ],
    site_name: process.env.NEXT_PUBLIC_BRAND_NAME
  } as OpenGraph
};
