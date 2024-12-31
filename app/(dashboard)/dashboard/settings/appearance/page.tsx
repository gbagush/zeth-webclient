"use client";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";

export default function AccountPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Appearance</h3>
        <p className="text-sm text-muted-foreground">
          Customize the appearance of the app. Automatically switch between day
          and night themes.
        </p>
      </div>
      <Separator />
      <div className="">
        <h3 className="text-sm font-normal">Theme</h3>
        <p className="text-sm text-muted-foreground">
          Select the theme for the dashboard.
        </p>
      </div>

      <div className="flex gap-4">
        <button onClick={() => setTheme("light")}>
          <div className="w-48">
            <div
              className={`items-center rounded-md border-2 ${theme == "light" ? "border-foreground" : "border-muted"} p-1`}
            >
              <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                  <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
                  <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                </div>
                <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                  <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                  <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                </div>
                <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                  <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                  <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                </div>
              </div>
            </div>
            <span className="block w-full p-2 text-sm text-center font-normal">
              Light
            </span>
          </div>
        </button>

        <button onClick={() => setTheme("dark")}>
          <div className="w-48">
            <div
              className={`items-center rounded-md border-2 ${theme == "dark" ? "border-foreground" : "border-muted"} bg-popover p-1 hover:bg-accent hover:text-accent-foreground`}
            >
              <div className="space-y-2 rounded-sm bg-slate-950 p-2">
                <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                  <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
                  <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                </div>
                <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                  <div className="h-4 w-4 rounded-full bg-slate-400" />
                  <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                </div>
                <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                  <div className="h-4 w-4 rounded-full bg-slate-400" />
                  <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                </div>
              </div>
            </div>
            <span className="block w-full p-2 text-sm text-center font-normal">
              Dark
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}
