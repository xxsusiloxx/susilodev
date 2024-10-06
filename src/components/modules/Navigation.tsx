"use client";

import { ExitIcon, HandIcon } from "@radix-ui/react-icons";

import * as React from "react";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export function Navbar() {
  const { data: session, status } = useSession();
  //   console.log("dataku: ", session);

  const isAutenticated = status === "authenticated";
  //   const isUnautenticated = status === "unauthenticated";
  const isLoading = status === "loading";

  const name = session?.user?.name;
  const image = session?.user?.image;

  return (
    <section className="w-full flex justify-between py-0 shadow-sm">
      <NavigationMenu className="flex justify-between py-3 flex-row w-full max-w-[1350px] mx-auto px-3 lg:px-0">
        <NavigationMenuList className="px-2">
          <HandIcon className="w-5 h-5" />
          <span className="font-bold font-sans text-xl">Grabjob</span>{" "}
        </NavigationMenuList>

        {/* {isUnautenticated && (
          <NavigationMenuList className="justify-end flex flex-row w-auto">
            <span className="text-sm text-gray-600 cursor-pointer font-bold hover:text-gray-900">
              Sign in
            </span>
          </NavigationMenuList>
        )} */}

        {name && image && isAutenticated && (
          <NavigationMenuList className="justify-end flex flex-row w-auto">
            <NavigationMenuItem>
              <NavigationMenuTrigger className="gap-2">
                <span>
                  <Avatar className="h-6 w-6 ">
                    <AvatarImage src={image as string} />
                    <AvatarFallback>
                      <div className="w-full h-full rounded-full bg-slate-300 animate-pulse"></div>
                    </AvatarFallback>
                  </Avatar>
                </span>

                {name && isAutenticated && (
                  <span className="hidden lg:flex">{name}</span>
                )}

                {isLoading && (
                  <span className="hidden h-4 lg:flex bg-slate-300 rounded-sm animate-pulse w-20"></span>
                )}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid py-4 px-0 md:w-[160px] lg:w-[120px]">
                  <li className="gap-2  cursor-pointer flex lg:hidden justify-end">
                    <span className="text-sm font-medium">{name}</span>
                  </li>

                  <li className="gap-2 px-0 cursor-pointer flex justify-end items-center">
                    <span
                      onClick={() => signOut()}
                      className="text-sm font-bold text-red-700"
                    >
                      Sign out
                    </span>

                    <ExitIcon className="w-3 h-3 text-red-700 " />
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        )}
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
