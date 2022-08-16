import type { AppProps } from "next/app";

import Layout from "../Components/Layout";
import "../styles/global.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <div className="global">
        <Layout />
        <Component {...pageProps} />;
      </div>
    </>
  );
}

export default MyApp;
