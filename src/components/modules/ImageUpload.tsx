"use client";

import { useDropzone } from "react-dropzone";
import { useState } from "react";
import { Hand } from "lucide-react";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
} from "@/components/ui/drawer";
import FilteredSection from "@/components/modules/FilteredSection";
import { Button } from "../ui/button";

function fileSizeValidator(file: File) {
  if (file.size > 2 * 1024 * 1024) {
    return {
      code: "file-too-large",
      message: `File size is bigger than 2Mb`,
    };
  }

  return null;
}

export default function ImageUpload() {
  const [openDrawer, setOpenDrawer] = useState(false);

  const { getRootProps, getInputProps, acceptedFiles, fileRejections } =
    useDropzone({
      validator: fileSizeValidator,
      accept: {
        "image/png": [],
        "image/jpeg": [],
      },
      // maxSize: 2 * 1024 * 1024,
      maxFiles: 1,
      onDrop: () => setOpenDrawer(true),
    });

  const acceptedImg = acceptedFiles[0];

  return (
    <section className="w-full flex flex-col mx-auto justify-center items-center">
      <div className="flex items-center justify-center h-screen">
        <section
          className="fixed lg:absolute max-w-[500px] mx-auto group h-14 lg:h-40 right-5 left-5 bottom-14 lg:bottom-1/2 lg:top-1/2  z-50 dropzone py-4 bg-slate-100 gap-1 font-medium text-gray-500 flex flex-col justify-center items-center cursor-pointer rounded-2xl lg:rounded-3xl"
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <p className="text-sm px-2 flex flex-row">
            <Hand className="w-auto h-4 mr-2 group-hover:animate-bounce " />
            Drag or click to select image
          </p>
        </section>
      </div>

      <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
        <DrawerContent className="h-auto bg-white">
          <section className="w-full flex flex-col  h-screen  justify-end items-center">
            <FilteredSection
              acceptedImg={acceptedImg}
              acceptedFiles={acceptedFiles}
              fileRejections={fileRejections}
            />
          </section>
          <DrawerFooter className="">
            <DrawerClose className="text-sm w-full  mx-auto md:text-base font-medium text-red-400 tracking-wider">
              <Button
                className="w-full bg-red-50 hover:bg-red-800/70 hover:text-white text-red-900 shadow-none max-w-[400px] rounded-lg text-xs"
                size="sm"
              >
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </section>
  );
}
