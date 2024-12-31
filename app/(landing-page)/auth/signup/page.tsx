"use client";

import axios from "axios";
import Link from "next/link";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function Page() {
  const { toast } = useToast();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    profile_image: "",
    terms: false,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Failed create account",
        description: "Passwords do not match",
      });
      return;
    }

    if (!signupData.terms) {
      toast({
        title: "Failed create account",
        description: "You must agree to the terms of service",
      });

      return;
    }

    try {
      setIsLoading(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/register`,
        signupData
      );

      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/verify`,
        {
          email: signupData.email,
        }
      );
      setIsLoading(false);

      toast({
        title: "Account created successfully",
        description: "Please verify your account",
      });

      router.push("/auth/verify/success");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          title: "Failed create account",
          description: error.response?.data.message || "An error occurred.",
        });
      } else {
        toast({
          title: "Failed create account",
          description: "Network error. Please try again.",
        });
      }
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Please fill out the information below to sign up for an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Jhon Doe"
                  onChange={(e) =>
                    setSignupData({ ...signupData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  onChange={(e) =>
                    setSignupData({ ...signupData, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Username</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="JhonDoe"
                  onChange={(e) =>
                    setSignupData({ ...signupData, username: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  onChange={(e) =>
                    setSignupData({ ...signupData, password: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Confirm Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Confirm your password"
                  onChange={(e) =>
                    setSignupData({
                      ...signupData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={signupData.terms}
                  onCheckedChange={() => {
                    setSignupData({ ...signupData, terms: !signupData.terms });
                  }}
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Accept terms and conditions
                </label>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="animate-spin" />}
                Sign Up
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account yet?{" "}
            <Link href="login" className="underline">
              Log In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
