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
import ProfileImage from "./profile-image";

export default function SettingsPage() {
  const [userData, setUserData] = useState<User>();

  const { toast } = useToast();
  const { token } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!token) return;

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUserData(response.data.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast({
            title: "Failed getting personal data",
            description:
              error.response?.data.message ||
              error.response?.data.details ||
              "An error occurred.",
          });
        } else {
          toast({
            title: "Failed getting personal data",
            description: "Network error. Please try again.",
          });
        }
      }
    };

    fetchUserData();
  }, [token]);

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (userData == undefined) {
      toast({
        title: "Failed update profile",
        description: "Not found user data",
      });
      return;
    }

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/update-profile`,
        { name: userData.name, username: userData.username },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        title: "Profile updated successfuly",
        description: response.data.message,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          title: "Failed update profile",
          description:
            error.response?.data.message ||
            error.response?.data.details ||
            "An error occurred.",
        });
      } else {
        toast({
          title: "Failed update profile",
          description: "Network error. Please try again.",
        });
      }
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          Manage your personal information and update your profile details to
          keep them current.
        </p>
      </div>
      <Separator />
      {userData !== undefined && (
        <>
          <ProfileImage />
          <form onSubmit={handleUpdateProfile}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={userData?.name}
                  onChange={(e) =>
                    setUserData({ ...userData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={userData?.username}
                  onChange={(e) =>
                    setUserData({ ...userData, username: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={userData?.email}
                  required
                  readOnly
                />
              </div>
            </div>
            <Button type="submit" className="mt-8">
              Update Profile
            </Button>
          </form>
        </>
      )}
    </div>
  );
}
