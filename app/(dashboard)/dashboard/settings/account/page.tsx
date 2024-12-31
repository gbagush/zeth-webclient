"use client";

import axios from "axios";

import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/authContext";
import { User } from "@/types/user";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { toast } = useToast();
  const { token, logout } = useAuth();
  const router = useRouter();

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Failed change password",
        description: "Fill all fields first",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Failed change password",
        description: "New password and confirm password not match",
      });
      return;
    }

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/change-password`,
        { old_password: oldPassword, new_password: newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast({
        title: "Password change successfuly",
        description: response.data.message,
      });

      setTimeout(() => {
        logout();
        router.push("/auth/login");
      }, 1000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          title: "Failed change password",
          description:
            error.response?.data.message ||
            error.response?.data.details ||
            "An error occurred.",
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
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Account</h3>
        <p className="text-sm text-muted-foreground">
          Secure your account by updating your password regularly to keep your
          information safe.
        </p>
      </div>
      <Separator />
      <form onSubmit={handleChangePassword}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Old password</Label>
            <Input
              id="old-password"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>New password</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Confirm password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <p className="text-sm text-muted-foreground mt-4">
          Forgot your password?{" "}
          <Link
            href="/auth/reset-password"
            className="text-foreground underline"
          >
            Reset now
          </Link>
        </p>

        <br />
        <Button type="submit" className="mt-4">
          Change Password
        </Button>
      </form>
    </div>
  );
}
