"use client";

import { Palette } from "lucide-react";

import * as React from "react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

import {
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

export function Navbar() {
  const { data: session, status } = useSession();

  return (
    <section className="w-full flex justify-between py-0 shadow-sm">
      <NavigationMenu className="flex justify-center lg:justify-start  py-3 flex-row w-full max-w-[1350px] mx-auto px-3 lg:px-0">
        <NavigationMenuList className="px-2">
          <Palette className="w-5 h-5" />
          <span className="font-bold font-sans text-xl">faceup</span>
        </NavigationMenuList>
      </NavigationMenu>
    </section>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
