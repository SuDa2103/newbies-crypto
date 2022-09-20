import { Button } from "antd";
import cls from "classnames";
import { Formik } from "formik";
import { Form, FormItem, Input } from "formik-antd";
import "formik-antd/es/input/style";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { object, string } from "yup";
import { host } from "../lib/config";

const InlineSignin = ({
  size = "spread-out"
}: {
  // esp on booking page, it's important not to redirect

  size?: "compact" | "spread-out";
}) => {
  const router = useRouter();

  const [emailSuccess, setEmailSuccess] = useState(false);
  const [sigininError, setSigninError] = useState(router.query.error as any);
  const [emailSubmitBtnLoading, setEmailButtonLoading] = useState(false);

  let redirect: string | string[] | undefined;
  ({ redirect } = router.query);

  const callbackUrl = redirect
    ? !sigininError
      ? (redirect as string)
      : host
    : router.asPath?.includes("/auth/signin")
    ? // in case of direct login /auth/signin page
      host
    : // in all other cases
      router.asPath;

  const doSubmit = async ({ _email }: { _email: string }) => {
    if (emailSubmitBtnLoading) {
      return false;
    }

    setSigninError(null);
    setEmailButtonLoading(true);

    const response: any = await signIn("email", {
      email: _email,
      callbackUrl: callbackUrl,
      redirect: false
    });

    if (response.error) {
      setSigninError(response.error);
      setEmailButtonLoading(false);
      return;
    }

    setEmailButtonLoading(false);
    setSigninError(null);
    setEmailSuccess(true);
  };

  const contextSpecificError = (override?: string) => {
    if (override) {
      return <div>{override}</div>;
    }

    if (!sigininError) {
      return null;
    }

    const errors = {
      Signin: "Try signing with a different account.",
      OAuthSignin: "Try signing with a different account.",
      OAuthCallback: "Try signing with a different account.",
      OAuthCreateAccount: "Try signing with a different account.",
      EmailCreateAccount: "Try signing with a different account.",
      Callback: "Try signing with a different account.",
      OAuthAccountNotLinked:
        "To confirm your identity, sign in with the same account you used originally.",
      EmailSignin: "Check your email address.",
      CredentialsSignin:
        "Sign in failed. Check the details you provided are correct.",
      default: "Unable to sign in."
    };

    return (
      <>
        <div>{errors[sigininError]}</div>
      </>
    );
  };

  return (
    <>
      {!emailSuccess && (
        <>
          <Formik
            initialValues={{
              email: ""
            }}
            onSubmit={() => {}}
            validationSchema={object().shape({
              email: string()
                .email("Incorrect email")
                .required("Email is required")
            })}
            validateOnChange={false}
            validateOnBlur={false}
            validateOnMount={false}
          >
            {({ errors, validateForm, setFieldError, values }) => {
              const checkBeforeSubmitting = async () => {
                const formErrors = await validateForm();

                if (formErrors.email) {
                  setFieldError("email", formErrors.email);
                  return;
                }

                await doSubmit({
                  _email: values.email as any
                });
              };

              return (
                <Form
                  layout="vertical"
                  style={{ paddingTop: "10vh" }}
                  className={cls({
                    "mt-8 mb-8": size === "spread-out",
                    "mt-4": size === "compact"
                  })}
                  onSubmitCapture={checkBeforeSubmitting}
                >
                  {sigininError && contextSpecificError()}
                  {!sigininError &&
                    errors.email &&
                    contextSpecificError(errors.email)}

                  <br></br>
                  <FormItem
                    name="email"
                    label="Email"
                    className="relative block"
                    showValidateSuccess={false}
                    help={false}
                  >
                    <Input
                      className={cls("mt-2 border-gray-400 h-12")}
                      name="email"
                      size="large"
                      type="email"
                      onPressEnter={checkBeforeSubmitting}
                      allowClear={true}
                      onChange={(e) => {
                        if (!e.target.value && !e.target.value.length) {
                          setFieldError("email", undefined);
                        }
                      }}
                    />
                  </FormItem>
                  <br></br>
                  <FormItem name="submitBtn">
                    <Button
                      type="primary"
                      size="large"
                      loading={emailSubmitBtnLoading}
                      disabled={emailSubmitBtnLoading}
                      style={{ width: "100%" }}
                      className={cls(
                        "h-12",
                        "w-full",
                        "mt-6",
                        "flex justify-center items-center"
                      )}
                      onClick={checkBeforeSubmitting}
                    >
                      {"Sign in"}
                    </Button>
                  </FormItem>
                </Form>
              );
            }}
          </Formik>
        </>
      )}

      {emailSuccess && (
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
          <h2>Check your inbox!</h2>
        </section>
      )}
    </>
  );
};

export default InlineSignin;
