"use client";
import { Link } from "@nextui-org/link";
import { button as buttonStyles } from "@nextui-org/theme";
import { useAuth } from "@/context/authContext";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { Download } from "lucide-react";

import ScreenshotLight from "@/public/screenshot-light.png";
import ScreenshotDark from "@/public/screenshot-dark.png";

import Image from "next/image";
import { useTheme } from "next-themes";

export default function Home() {
  const { theme } = useTheme();
  const { status } = useAuth();

  return (
    <section className="flex flex-col items-center justify-center gap-4 pt-8 md:pt-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title()}>Streamline Your Day</span>
        <br />
        <span className={title({ color: "blue" })}>Achieve More</span>
        <br />
        <span className={title()}>with Zeth</span>
        <div className={subtitle({ class: "mt-4" })}>
          Effortless Task Management at Your Fingertips.
        </div>
      </div>

      <div className="flex gap-3">
        {status == "logout" && (
          <Link
            className={buttonStyles({
              color: "primary",
              radius: "full",
              variant: "shadow",
            })}
            href="/auth/signup"
          >
            Register Now
          </Link>
        )}

        {status == "login" && (
          <Link
            className={buttonStyles({
              color: "primary",
              radius: "full",
              variant: "shadow",
            })}
            href="/dashboard"
          >
            Go to Dashboard
          </Link>
        )}
      </div>

      <div className="max-w-4xl py-8">
        {theme && (
          <Image
            alt="Zeth Screenshot"
            src={theme === "dark" ? ScreenshotDark : ScreenshotLight}
            width={1000}
            height={200}
            className="rounded-xl shadow-2xl ease-in-out duration-300 hover:scale-105"
          />
        )}
      </div>
    </section>
  );
}
