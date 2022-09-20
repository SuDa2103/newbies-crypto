import Head from "next/head";
import Link from "next/link";
import * as React from "react";
import * as types from "../lib/types";
import { PageHead } from "./PageHead";
import styles from "./styles.module.css";

export const Page404: React.FC<types.PageProps> = ({ site }) => {
  const title = site?.name || "Notion Page Not Found";

  return (
    <>
      <PageHead site={site} />

      <Head>
        <meta property="og:site_name" content={title} />
        <meta property="og:title" content={title} />

        <title>{title}</title>
      </Head>

      <div className={styles.container}>
        <main className={styles.main}>
          <h1>Page Not Found</h1>

          <Link href="/">
            <a>Home</a>
          </Link>
        </main>
      </div>
    </>
  );
};
