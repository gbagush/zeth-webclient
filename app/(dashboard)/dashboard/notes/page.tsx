"use client";

import dayjs from "dayjs";

import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import Icon from "@/components/shared/icon";
import { Input } from "@/components/ui/input";
import useCategories from "@/stores/categories";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useAuth } from "@/context/authContext";
import { icons, Plus } from "lucide-react";
import { isColorDark } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import CategoryBadge from "@/components/shared/category-badge";

export default function NotesPage() {
  const { categories } = useCategories();

  const [notes, setNotes] = useState<Notes[]>([]);

  const { token } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchNotes = async () => {
      if (!token) return;
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/notes`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setNotes(response.data.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast({
            title: "Failed getting notes",
            description: error.response?.data.message || "An error occurred.",
          });
        } else {
          toast({
            title: "Failed getting notes",
            description: "Network error. Please try again.",
          });
        }
      }
    };

    fetchNotes();
  }, [token]);

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <Link href="/dashboard">Dashboard</Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Notes</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="px-4">
        <div className="flex items-center justify-between">
          <Input
            type="text"
            placeholder="Serach notes..."
            className="h-8 w-[150px] lg:w-[250px]"
          />
          <Link href="/dashboard/notes/create">
            <Button variant="outline" className="h-8">
              <Plus />
              Create note
            </Button>
          </Link>
        </div>

        <div className="rounded-md border mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180]">Created At</TableHead>
                <TableHead>Note</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(notes) &&
                notes.map((note) => (
                  <TableRow key={note._id}>
                    <TableCell className="font-medium">
                      {dayjs(note.created_at).format("MMM D, YYYY [at] HH:mm")}
                    </TableCell>
                    <TableCell className="font-medium">
                      <Link href={`/dashboard/notes/${note._id}`}>
                        {categories.map((category) =>
                          category._id === note.category ? (
                            <CategoryBadge
                              key={`${category._id}-${note._id}`}
                              category={category}
                            />
                          ) : null
                        )}
                        {note.title}
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
