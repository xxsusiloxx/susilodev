"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Search } from "lucide-react";
import { Filter } from "./Filter";

export function DrawerDetail() {
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="flex lg:hidden fixed bottom-11 right-4 shadow-sm h-14 w-14 bg-gray-800 rounded-full"
        >
          <Search className="w-full h-full text-white font-bold" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <Filter className="flex lg:hidden" />
      </DrawerContent>
    </Drawer>
  );
}
