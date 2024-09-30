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
import GTag from "./GTag";

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
      <GTag />

      <AccessProvider>
        <AccessBox />
      </AccessProvider>

      <FullscreenButton />

      <DirectoryAtom>
        <ASCII />
        <UserText />
        <TextRenderer />
        <MobileInput />
      </DirectoryAtom>

      <div
        style={{
          position: "fixed",
          bottom: "10px",
          right: "15px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
        }}
      >
        <span>{VERSION}</span>
        <span>Created by: Brenden Bushman</span>
      </div>
    </div>
  );
}
