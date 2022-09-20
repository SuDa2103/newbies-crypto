import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useEffect } from "react";
import InlineSignin from "../../components/InlineSignin";
import HomeIcon from "../../utils/components/HomeIcon";
import Layout from "../../utils/components/Layout";
import Shared from "../../utils/components/Shared";

const SignInPage: NextPage = () => {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      // redirect home
      router?.push("/");
    }
  }, [status]);

  return (
    <Layout
      title={`Sign in - ${process.env.NEXT_PUBLIC_BRAND_NAME}`}
      nextSeo={<NextSeo noindex={true} nofollow={true} />}
    >
      <Shared sharedParentMainClass={"thanks-page"}>
        <HomeIcon />

        <InlineSignin />
      </Shared>
    </Layout>
  );
};

export default SignInPage;
