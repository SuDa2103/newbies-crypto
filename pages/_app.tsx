// used for code syntax highlighting (optional)
// core styles shared by all of react-notion-x (required)
import { SessionProvider } from "next-auth/react";
import "../lib/react-notion-x/styles.css";
import "../styles/_app.scss";
import "../styles/_darkmode-toggle.scss";
import "../styles/_globals.scss";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    // `session` comes from `getServerSideProps` or `getInitialProps`.
    // Avoids flickering/session loading on first load.
    <SessionProvider session={session} refetchInterval={5 * 60}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
