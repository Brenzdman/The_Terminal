"use client";

import ASCII from "@/components/ASCII";
import FullscreenButton from "@/components/FullscreenButton";
import TextDisplayRenderer from "@/components/textRenderer";
import UserText from "@/components/UserText";

export default function Home() {
  return (
    <div>
      <ASCII />
      <FullscreenButton />
      <UserText />
      <TextDisplayRenderer />
    </div>
  );
}
