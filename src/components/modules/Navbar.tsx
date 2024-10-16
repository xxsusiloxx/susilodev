'use client';

import { Palette } from 'lucide-react';

import * as React from 'react';
import { cn } from '@/lib/utils';

import { NavigationMenu, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu';

export function Navbar() {
  return (
    <section className="flex w-full justify-between py-0 shadow-sm">
      <NavigationMenu className="mx-auto flex w-full  max-w-[1350px] flex-row justify-center p-3 lg:justify-start lg:px-0">
        <NavigationMenuList className="px-2">
          <Palette className="size-5" />
          <span className="font-sans text-xl font-bold">lightpixel</span>
        </NavigationMenuList>
      </NavigationMenu>
    </section>
  );
}

const ListItem = React.forwardRef<React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors',
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  },
);
ListItem.displayName = 'ListItem';
