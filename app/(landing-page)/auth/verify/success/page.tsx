"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Link from "next/link";

export default function RequestVerifyPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Success Send Verify Email</CardTitle>
          <CardDescription>
            Please check your inbox and follow the instructions in the email to
            verify your account. If you don&apos;t see the email, be sure to
            check your junk or spam folder.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
