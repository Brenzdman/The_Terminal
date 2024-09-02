"use client";

import ASCII from "@/components/ASCII";
import { DirectoryAtom } from "@/components/DirectoryAtom";
import FullscreenButton from "@/components/FullscreenButton";
import TextRenderer from "@/components/TextRenderer";
import UserText from "@/components/UserText";
import React from "react";

export default function Home() {
  return (
    <div>
      <meta
        name="google-site-verification"
        content="hhhgfqTYYPQugAs6cLEnyHM7z1sMIaKjdCIxFysX58M"
      />
      <DirectoryAtom>
        <ASCII />
        <UserText />
        <TextRenderer />
        <FullscreenButton />
      </DirectoryAtom>
    </div>
  );
}
