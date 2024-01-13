import { SignIn, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import Head from "next/head";
import Image from "next/image";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

import { RouterOutputs, api } from "~/utils/api";
import { Input } from "~/components/ui/input";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { LoadingPage, LoadingSpinner } from "~/components/global/loading";
import { useState } from "react";
import toast from "react-hot-toast";
import { PageLayout } from "~/components/global/layout";
import { PostView } from "~/components/global/postview";

dayjs.extend(relativeTime);

const CreatePostWizard = () => {
  const { user } = useUser();
  const [input, setInput] = useState<string>("");
  console.log(user);
  const ctx = api.useUtils();

  const { mutate, isLoading: isPosting } = api.post.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.post.getAll.invalidate();
    },
    onError: (err) => {
      // toast.error("Invalid Emoji 😢");
      const errorMessage = err.data?.zodError?.fieldErrors.content;
      console.log(errorMessage);
      if (errorMessage && errorMessage[0]) toast?.error(errorMessage[0]);
      else toast.error("Something went wrong ❓");
    },
  });
  if (!user) return null;


  return (
    <div className="mx-2 mt-4 flex flex-row items-center justify-center gap-2">
      <Image
        src={user.imageUrl}
        alt="Profile Image"
        className="rounded-full"
        width={56}
        height={56}
      />
      <Input
        placeholder="What's on your mind?"
        value={input}
        type="text"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            mutate({ content: input });
            setInput("");
          }
        }}
        onChange={(e) => setInput(e.target.value)}
        disabled={isPosting}
      />
      {input !== "" && !isPosting && (
        <Button
          onClick={() => {
            mutate({ content: input });
            setInput("");
          }}
          disabled={isPosting}
          className=" items-center justify-center"
        >
          Post
        </Button>
      )}

      {isPosting && (
        <div className="flex items-center justify-center">
          <LoadingSpinner size={20} />
        </div>
      )}
    </div>
  );
};

const Feed = () => {
  const { data, isLoading: postsLoading } = api.post.getAll.useQuery();

  if (postsLoading) return <LoadingPage />;

  if (!data) return <div className="flex flex-col text-2xl text-center justify-center">Sign In to see emoji spammer</div>;

  return (
    <div className="mt-4 border-t border-slate-200">
      {[...data].map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
};

export default function Home() {
  const { isLoaded: userLoaded, isSignedIn } = useUser();
  const { setTheme } = useTheme();

  api.post.getAll.useQuery();

  if (!userLoaded) return <div />;

  return (
    <>
      <Head>
        <title>T3 Git</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageLayout>
        <div className="mt-2 flex h-[40px] flex-row gap-2">
          <div className="ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <MoonIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="min-h-screen flex-col items-center justify-center">
            {!isSignedIn && (
              <Button>
                <SignInButton />
              </Button>
            )}
            {isSignedIn && (
              <Button>
                <SignOutButton />
              </Button>
            )}
          </div>
          <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
        </div>
        {isSignedIn && <CreatePostWizard />}
        <Feed />
      </PageLayout>
    </>
  );
}
