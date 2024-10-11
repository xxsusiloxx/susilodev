'use client';

import { FileWithPath, useDropzone } from 'react-dropzone';
import { useState } from 'react';
import { Hand } from 'lucide-react';

import { Drawer, DrawerClose, DrawerContent, DrawerFooter } from '@/components/ui/drawer';
import FilteredSection from '@/components/modules/FilteredSection';
import { Button } from '../ui/button';

function fileSizeValidator(file: File) {
  if (file.size > 2 * 1024 * 1024) {
    return {
      code: 'file-too-large',
      message: `File size is bigger than 2Mb`,
    };
  }

  return null;
}

export default function ImageUpload() {
  const [openDrawer, setOpenDrawer] = useState(false);

  const { getRootProps, getInputProps, acceptedFiles, fileRejections } = useDropzone({
    validator: fileSizeValidator,
    accept: {
      'image/png': [],
      'image/jpeg': [],
    },
    // maxSize: 2 * 1024 * 1024,
    maxFiles: 1,
    onDrop: () => setOpenDrawer(true),
  });

  const acceptedImg = acceptedFiles[0];

  return (
    <section className="mx-auto flex w-full flex-col items-center justify-center">
      <div className="flex h-screen items-center justify-center">
        <section
          className="dropzone group fixed inset-x-5 bottom-12 z-50 mx-auto flex h-14 max-w-[800px] cursor-pointer flex-col  items-center justify-center gap-1 rounded-2xl bg-slate-100 py-4 font-medium text-gray-500 hover:bg-slate-200/60 lg:absolute lg:bottom-auto lg:top-1/4 lg:h-60 lg:rounded-3xl"
          {...getRootProps()}
        >
          <input {...getInputProps()} className="cursor-pointer outline-none focus:outline-none" />
          <p className="flex flex-row px-2 text-sm">
            <Hand className="mr-2 h-4 w-auto group-hover:animate-bounce " />
            Drag or click to select image
          </p>
        </section>
      </div>

      <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
        <DrawerContent className="h-auto bg-white">
          <section className="flex h-screen w-full  flex-col  items-center justify-end">
            <FilteredSection acceptedImg={acceptedImg} acceptedFiles={acceptedFiles} fileRejections={fileRejections} />
          </section>
          <DrawerFooter className="">
            <DrawerClose className="mx-auto w-full  text-sm font-medium tracking-wider text-red-400 md:text-base">
              <Button
                className="w-full max-w-[400px] rounded-lg bg-red-50 text-xs text-red-900 shadow-none hover:bg-red-800/70 hover:text-white"
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
