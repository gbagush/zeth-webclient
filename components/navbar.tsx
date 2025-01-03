"use client";

import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Button } from "./ui/button";
import { Link } from "@nextui-org/link";
import NextLink from "next/link";
import { useAuth } from "@/context/authContext";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { GithubIcon, Logo } from "@/components/icons";

export const Navbar = () => {
  const { status } = useAuth();
  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Logo />
            <p className="font-bold text-inherit">ZETH</p>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className="hidden md:flex">
          {status == "logout" && (
            <Link href="/auth/login">
              <Button className="text-sm font-normal ">Login</Button>
            </Link>
          )}
          {status == "login" && (
            <Link href="/dashboard">
              <Button className="text-sm font-normal ">Dashboard</Button>
            </Link>
          )}
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        {status == "logout" && (
          <Link href="/auth/login">
            <Button className="text-sm font-normal ">Login</Button>
          </Link>
        )}
        {status == "login" && (
          <Link href="/dashboard">
            <Button className="text-sm font-normal ">Dashboard</Button>
          </Link>
        )}
      </NavbarContent>
    </NextUINavbar>
  );
};
