import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { Space_Grotesk } from "next/font/google";
import Head from "next/head";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "~/components/global/theme-provider";
import { Toaster } from "react-hot-toast";

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
        <title>T3 Git</title>
        <meta name="description" content="T3 Git" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex items-start">
        <div className="min-h-screen flex-grow border-x">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ClerkProvider>
              <Toaster position="top-center" />
              <Component {...pageProps} />
            </ClerkProvider>
          </ThemeProvider>
        </div>
      </div>
    </main>
  );
};

export default api.withTRPC(MyApp);
