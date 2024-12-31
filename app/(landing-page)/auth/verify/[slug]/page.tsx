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

export default function RequestVerifyPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/verify/${slug}`
      );

      toast({
        title: "Account activate successfully!",
        description: "Please login to start using your account.",
      });

      router.push("/auth/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);

        toast({
          title: "Failed verify account",
          description: error.response?.data.detail || "An error occurred.",
        });
      } else {
        toast({
          title: "Failed verify account",
          description: "Network error. Please try again.",
        });
      }
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Verify Your Email</CardTitle>
          <CardDescription>
            Please click the button below to verify your email. If you did not
            register on this platform, no further action is required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify}>
            <div className="grid gap-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="animate-spin" />}
                Verify my email
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Exipred link?{" "}
            <Link href="/auth/verify" className="underline">
              Create a new one
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
