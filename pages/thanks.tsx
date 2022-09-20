import { NextPage } from "next";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";
import { fetchGetJSON } from "../utils/api-helpers";
import HomeIcon from "../utils/components/HomeIcon";
import Layout from "../utils/components/Layout";
import Shared from "../utils/components/Shared";

const ThanksPage: NextPage = () => {
  const router = useRouter();

  const { data, error } = useSWR(
    router.query.session_id
      ? `/api/checkout_sessions/${router.query.session_id}`
      : null,
    fetchGetJSON
  );

  if (error) return <div>failed to load</div>;

  return (
    <Layout
      title={`Thanks | ${process.env.NEXT_PUBLIC_BRAND_NAME}`}
      nextSeo={<NextSeo noindex={true} nofollow={true} />}
    >
      <Shared sharedParentMainClass={"thanks-page"}>
        <HomeIcon />

        <div className="with-bg"></div>

        <br></br>

        <section className="mw-wrapper section">
          <span className="success-checkmark-content">
            <svg
              className="checkmark"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 52 52"
            >
              <circle
                className="checkmark__circle"
                cx="26"
                cy="26"
                r="25"
                fill="none"
              />
              <path
                className="checkmark__check"
                fill="none"
                d="M14.1 27.2l7.1 7.2 16.7-16.8"
              />
            </svg>
          </span>
          <h2>Thank you!</h2>

          <p className="description">
            You can now <Link href="/auth/signin">sign in</Link> to access{" "}
            {process.env.NEXT_PUBLIC_BRAND_NAME}.<br></br>
            <br></br> A purchase confirmation has been sent to{" "}
            {data?.customer_details?.email ?? "your inbox"}.
          </p>
        </section>
      </Shared>
    </Layout>
  );
};

export default ThanksPage;
