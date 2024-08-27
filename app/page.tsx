"use client";

import ASCII from "@/components/ASCII";
import FullscreenButton from "@/components/FullscreenButton";
import TextDisplayRenderer from "@/components/textRenderer";
import UserText from "@/components/UserText";

export default function Home() {
  return (
    <div>
      <meta
        name="google-site-verification"
        content="hhhgfqTYYPQugAs6cLEnyHM7z1sMIaKjdCIxFysX58M"
      />

      <ASCII />
      <FullscreenButton />
      <UserText />
      <TextDisplayRenderer />
    </div>
  );
}
