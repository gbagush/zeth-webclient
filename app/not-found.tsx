"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-full flex flex-col min-h-screen items-center justify-center pad-x">
      <h1 className="text-9xl font-extrabold text-foreground/20">404</h1>
      <p className="text-center font-medium pt-2 pb-5">
        Sorry, you can&apos;t find the page you&apos;re looking for.
      </p>
      <Link href="/">
        <Button>Try Again!</Button>
      </Link>
    </div>
  );
}
