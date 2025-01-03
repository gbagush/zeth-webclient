"use client";
import React, { useEffect, useState } from "react";

import { Link } from "@nextui-org/link";
import { button as buttonStyles } from "@nextui-org/theme";
import { useAuth } from "@/context/authContext";

import { title, subtitle } from "@/components/primitives";

import ScreenshotLight from "@/public/screenshot-light.png";
import ScreenshotDark from "@/public/screenshot-dark.png";

import Image from "next/image";
import { useTheme } from "next-themes";

import ReactPlayer from "react-player";
import { Play } from "lucide-react";

export default function Home() {
  const { theme } = useTheme();
  const { status } = useAuth();

  const [isVideo, setIsVideo] = useState(false);

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
        {status === "logout" && (
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

        {status === "login" && (
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

        <Link
          className={buttonStyles({
            color: "primary",
            radius: "full",
            variant: "bordered",
          })}
          href="https://youtu.be/FZHcu1MMMN4?si=K0AEWHIj1DXBMyr3"
          target="_blank"
        >
          <Play size={16} />
          Presentation
        </Link>
      </div>

      <div
        role="button"
        className="max-w-4xl py-8"
        onClick={() => {
          if (!isVideo) setIsVideo(true);
        }}
      >
        {isVideo ? (
          <ReactPlayer
            url="https://res.cloudinary.com/dkhpios4h/video/upload/v1735899448/github/zeth-webclient/giphdaffndtgk9bkypbs.mp4"
            width="100%"
            height="100%"
            controls
          />
        ) : (
          theme && (
            <div className="flex items-center justify-center">
              <div role="button" className="relative w-full h-full group">
                <Image
                  alt="Zeth Screenshot"
                  src={theme === "dark" ? ScreenshotDark : ScreenshotLight}
                  width={1000}
                  height={200}
                  className="rounded-xl shadow-2xl ease-in-out duration-300"
                />
                <div
                  className="absolute inset-0 flex items-center justify-center bg-opacity-25 opacity-0 transition-opacity rounded-lg duration-300 bg-white group-hover:opacity-50"
                  role="button"
                >
                  <Play size={32} />
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
}
