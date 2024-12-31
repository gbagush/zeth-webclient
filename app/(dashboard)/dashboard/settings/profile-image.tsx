"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/authContext";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Loader2, Trash } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

export default function ProfileImage() {
  const { toast } = useToast();
  const { token, user, fetchUserData } = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  const [profileImage, setProfileImage] = useState(
    user.profile_picture || null
  );

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 512 * 1024) {
        toast({
          title: "File size limit exceeded",
          description: "Please upload an image smaller than 512KB.",
        });
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      setSelectedFile(file);
    }
  };

  const handleDeleteImage = () => {
    setProfileImage(null);
    setSelectedFile(null);
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64Data = reader.result as string;
        const base64String = base64Data.split(",")[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleUpdateProfileImage = async () => {
    if (!token) {
      return;
    }

    if (!selectedFile) {
      return;
    }

    const base64String = await convertToBase64(selectedFile);

    try {
      setIsLoading(true);

      toast({
        title: "Uploading your profile image",
      });

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/profile-picture`,
        {
          image: base64String,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsLoading(false);

      toast({
        title: "Profile image updated successfully",
        description: response.data.message,
      });

      fetchUserData(token);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          title: "Failed update profile image",
          description: error.response?.data.detail || "An error occurred.",
        });
      } else {
        toast({
          title: "Failed update profile image",
          description: "Network error. Please try again.",
        });
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <div className="flex gap-2 items-center" role="button">
          <Avatar className="rounded-lg">
            {profileImage ? (
              <AvatarImage src={profileImage} />
            ) : (
              <AvatarFallback>CN</AvatarFallback>
            )}
          </Avatar>
          <div className="flex flex-col text-start">
            <span className="text-sm">Profile Image</span>
            <span className="text-xs text-muted-foreground">
              Click to change profile image
            </span>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[375px]">
        <DialogHeader>
          <DialogTitle>Profile Image</DialogTitle>
          <DialogDescription>
            Choose a new image to represent your profile. Make it unique and
            truly yours!
          </DialogDescription>
        </DialogHeader>

        {profileImage ? (
          <div className="flex items-center justify-center">
            <div role="button" className="relative w-full h-full group">
              <Image
                src={profileImage}
                height={512}
                width={512}
                alt="User profile picture"
                className="aspect-square object-cover rounded-lg"
              />
              <div
                className="absolute inset-0 flex items-center justify-center bg-opacity-25 opacity-0 transition-opacity rounded-lg duration-300 bg-white group-hover:opacity-100"
                onClick={handleDeleteImage}
                role="button"
              >
                <Trash size={32} />
              </div>
            </div>
          </div>
        ) : (
          <Input type="file" accept="image/*" onChange={handleFileChange} />
        )}

        <DialogFooter>
          <Button
            type="submit"
            disabled={isLoading}
            onClick={handleUpdateProfileImage}
          >
            {isLoading && <Loader2 className="animate-spin" />}
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
