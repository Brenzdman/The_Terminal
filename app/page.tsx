"use client";

import Head from "next/head";
import AccessBox from "@/components/AccessBox";
import ASCII from "@/components/ASCII";
import { DirectoryAtom } from "@/components/DirectoryAtom";
import FullscreenButton from "@/components/FullscreenButton";
import TextRenderer from "@/components/TextRenderer";
import UserText from "@/components/UserText";
import { AccessProvider } from "@/components/AccessProvider";
import React from "react";
import { VERSION } from "@/constants/constants";
import MobileInput from "@/components/MobileInput";

export default function Home() {
  return (
    <div>
      <Head>
        <link rel="canonical" href="https://cmdterminal.vercel.app" />
        <meta
          name="google-site-verification"
          content="hhhgfqTYYPQugAs6cLEnyHM7z1sMIaKjdCIxFysX58M"
        />
        <meta
          name="description"
          content="This is an online emulator of a Windows terminal that will have secrets implemented in the future."
        />
        <meta
          name="keywords"
          content="Windows, Terminal, Command, Prompt, Emulator, Online"
        />
      </Head>

      <AccessProvider>
        <AccessBox />
      </AccessProvider>

      <DirectoryAtom>
        <ASCII />
        <UserText />
        <TextRenderer />
        <FullscreenButton />
        <MobileInput />
      </DirectoryAtom>

      <span
        style={{
          position: "fixed",
          bottom: "10px",
          right: "15px",
        }}
      >
        {VERSION}
      </span>
    </div>
  );
}
