"use client";

import dayjs from "dayjs";
import { useEffect, useState } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { quotes } from "@/config/quotes";
import Homepage from "@/components/homepage/homepage";

export default function Page() {
  const [selectedQuotes, setSelectedQuotes] = useState({
    quote: "",
    person: "",
  });

  useEffect(() => {
    const updateQuote = () => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setSelectedQuotes(quotes[randomIndex]);
    };

    updateQuote();
    const intervalId = setInterval(updateQuote, 10000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="px-4">
        <div>
          <h3 className="text-lg font-medium">
            {dayjs().format("dddd, DD MMMM YYYY")}
          </h3>
          <p className="text-sm text-muted-foreground">
            &quot;{selectedQuotes.quote}&quot; ~{selectedQuotes.person}
          </p>
        </div>

        <Separator />

        <Homepage />
      </div>
    </>
  );
}
