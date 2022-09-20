import { NextPage } from "next";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

const SignOutPage: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    signOut({ redirect: false });
    router?.push("/");
  }, [router]);

  return <></>;
};

export default SignOutPage;
