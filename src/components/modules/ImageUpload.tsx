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
      <section
        className="fixed   right-5 left-5  bottom-10 z-50 dropzone py-4 bg-slate-100 gap-1 font-medium text-gray-500 flex flex-col justify-center items-center cursor-pointer  rounded-full lg:rounded-4xl"
        {...getRootProps()}
      >
        <input {...getInputProps()} />

        <p className="text-sm  px-2 flex fle-row">
          <Hand className=" w-auto h-4 mr-2" />
          Drag or click to select image
        </p>
      </section>

      <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
        <DrawerContent className="h-auto">
          <section className="w-full flex flex-col  h-screen  justify-end items-center">
            <FilteredSection
              acceptedImg={acceptedImg}
              acceptedFiles={acceptedFiles}
              fileRejections={fileRejections}
            />
          </section>
          <DrawerFooter className="">
            <DrawerClose className="text-lg font-medium text-red-400 tracking-wider">
              cancel
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </section>
  );
}
