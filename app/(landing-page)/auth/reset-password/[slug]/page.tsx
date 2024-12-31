"use client";

import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function RequestVerifyPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassowrd, setConfirmPassowrd] = useState("");

  const { toast } = useToast();
  const router = useRouter();

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!password || !confirmPassowrd) {
      toast({
        title: "Failed change password",
        description: "Fill all field first",
      });

      return;
    }

    if (password !== confirmPassowrd) {
      toast({
        title: "Failed change password",
        description: "Password and confirm password not match",
      });
      return;
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/reset-password/${slug}`,
        {
          password: password,
        }
      );

      toast({
        title: "Password changed successfully!",
        description: "Please login to start using your account.",
      });

      router.push("/auth/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);

        toast({
          title: "Failed change password",
          description: error.response?.data.detail || "An error occurred.",
        });
      } else {
        toast({
          title: "Failed change password",
          description: "Network error. Please try again.",
        });
      }
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">New Password</CardTitle>
          <CardDescription>
            Please fill all fields bellow to set your new password. If you did
            not request reset password, no further action is required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">New password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your new password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Confirm new password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm your new password"
                  onChange={(e) => setConfirmPassowrd(e.target.value)}
                  value={confirmPassowrd}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="animate-spin" />}
                Setup new password
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Exipred link?{" "}
            <Link href="/auth/reset-password" className="underline">
              Create a new one
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
