import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { Space_Grotesk } from "next/font/google";
import Head from "next/head";
import { ClerkProvider } from "@clerk/nextjs";

const fonts = Space_Grotesk({
  weight: ["400", "700"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <main className={fonts.className}>
      <Head>
        <title>NextAuth.js Example</title>
        <meta name="description" content="NextAuth.js Example" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex items-start">
        <div className="min-h-screen flex-grow border-x">
          <ClerkProvider>
            <Component {...pageProps} />
          </ClerkProvider>
        </div>
      </div>
    </main>
  );
};

export default api.withTRPC(MyApp);
