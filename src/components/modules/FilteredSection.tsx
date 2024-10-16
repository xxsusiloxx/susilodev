import Image from 'next/image';
import { saveAs } from 'file-saver';

import { Card, CardContent, CardDescription, CardFooter, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Ban, Highlighter, Sparkles, Crop as CropIcon } from 'lucide-react';
import React, { Fragment, useState, useEffect, memo } from 'react';
import { FileRejection } from 'react-dropzone';
import cv from 'opencv-ts'; // Import OpenCV
import { cn } from '@/lib/utils';
import Mat from 'opencv-ts/src/core/Mat';

/**
 * A small icon component that displays a symbol.
 * @param {{ simbol: string }} props
 * @prop {string} simbol - The symbol to display
 * @returns {JSX.Element}
 */
const Icon = ({ simbol }: { simbol: string }) => (
  <div className="flex size-8 items-center justify-center text-2xl font-bold">{simbol}</div>
);

const downloadImage = () => {
  const canvas = document.querySelector('#canvasOutput') as HTMLCanvasElement;
  if (canvas) {
    canvas.toBlob((blob) => {
      if (blob) {
        saveAs(blob, `processed-${Date.now()}.png`); // Save the blob as a file
      }
    });
  }
};

const listEffect = [
  { id: 'normal', name: 'Normal', icon: <Icon simbol="N" /> },
  {
    id: 'grayscale',
    name: 'Grayscale',
    icon: <Icon simbol="G" />,
  },
  {
    id: 'graybold',
    name: 'Graybold',
    icon: <Highlighter className="size-6 font-normal" />,
  },

  {
    id: 'rusian-beauty',
    name: 'Rusian Beauty',
    icon: <Sparkles className="size-6 font-normal" />,
  },
  {
    id: 'square-crop',
    name: 'Forcesquare Crop',
    icon: <CropIcon className="size-6 font-normal" />,
  },
];

function getNameEffect(id: string): React.ReactNode {
  const findEffect = listEffect.find((effect) => effect.id === id);
  if (findEffect) {
    return findEffect.name;
  }
  return '-';
}

interface FileWithPath extends File {
  path: string;
}

interface FileRejectionWithPath extends FileRejection {
  path: string;
}

interface FilterProps {
  acceptedImg?: Blob | null;
  acceptedFiles?: FileWithPath[] | File[];
  fileRejections: FileRejection[];
}

const FileList = ({ files }: { files: FileWithPath[] }) => (
  <ul className="mb-5 mt-2 flex flex-col gap-1">
    {files.map((file: FileWithPath) => (
      <li key={file.path} className="truncate text-start font-mono text-[0.65rem] italic text-slate-500">
        <span className="truncate rounded-sm bg-blue-50 px-2  py-1 text-slate-500">{file.path}</span>
      </li>
    ))}
  </ul>
);

const ErrorList = ({ errors }: { errors: Array<{ code: string; message: string }> }) => (
  <ul className="my-2 mb-3 font-mono text-xs italic text-red-500">
    {errors.map(({ code, message }) => (
      <li className="text-xs" key={code}>
        {message}
      </li>
    ))}
  </ul>
);

const FilteredSection = memo(function FilteredSection({ acceptedImg, acceptedFiles, fileRejections }: FilterProps) {
  const [activeTab, setActiveTab] = useState('normal');
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);

  useEffect(() => {
    if (acceptedImg) {
      const url = URL.createObjectURL(acceptedImg);
      setObjectUrl(url);

      // Cleanup function to revoke the object URL when acceptedImg changes
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setObjectUrl(null); // Clear the URL if no image is accepted
    }
  }, [acceptedImg]);

  useEffect(() => {
    const applyEffect = (src: Mat.Mat) => {
      let dst = new cv.Mat();

      try {
        switch (activeTab) {
          case 'graybold':
            // Apply graybold effect
            cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY);
            cv.medianBlur(src, src, 7);
            const edges = new cv.Mat();
            cv.adaptiveThreshold(src, edges, 255, cv.ADAPTIVE_THRESH_MEAN_C, cv.THRESH_BINARY, 9, 2);
            const color = new cv.Mat();
            cv.bilateralFilter(src, color, 9, 75, 75, cv.BORDER_DEFAULT);
            cv.bitwise_and(color, color, dst, edges);
            edges.delete();
            color.delete();
            break;

          case 'grayscale':
            cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
            break;

          case 'rusian-beauty':
            cv.cvtColor(src, src, cv.COLOR_RGBA2RGB, 0);
            cv.bilateralFilter(src, dst, 9, 75, 100, cv.BORDER_DEFAULT);
            break;

          case 'square-crop':
            const srcHeight = src.rows;
            const srcWidth = src.cols;
            const size = Math.min(srcHeight, srcWidth);
            const x = Math.floor((srcWidth - size) / 2);
            const y = Math.floor((srcHeight - size) / 2);
            const rect = new cv.Rect(x, y, size, size);
            dst = src.roi(rect);
            break;

          default:
            dst = src.clone();
            break;
        }
      } catch (error) {
        console.error(error);
      }

      return dst;
    };

    if (objectUrl) {
      const imgElement = document.createElement('img');
      imgElement.src = objectUrl;

      imgElement.onload = () => {
        const src = cv.imread(imgElement);
        const dst = applyEffect(src);

        const canvas = document.querySelector('#canvasOutput') as HTMLCanvasElement;
        if (canvas) {
          cv.imshow(canvas, dst);
          setProcessedImage(canvas.toDataURL());

          // Delete src and dst after drawing on the canvas
          src.delete();
          dst.delete(); // delete dst after imshow()
        }
      };

      // Bersihkan sumber daya lain yang terkait dengan imgElement
      return () => {
        imgElement.remove();
      };
    } else {
      setProcessedImage(null);
    }
  }, [activeTab, objectUrl]);

  return (
    <>
      <Tabs defaultValue="normal" onValueChange={(value) => setActiveTab(value)}>
        <TabsContent value={activeTab} className="">
          <Card
            className={cn([
              'absolute inset-x-0 mx-auto flex w-full max-w-[400px]  flex-col justify-end border-none bg-transparent p-0 shadow-none',
              Boolean(processedImage || objectUrl) ? 'bottom-32' : 'bottom-12',
            ])}
          >
            <CardContent className="mx-auto flex h-auto w-full flex-col items-center justify-center space-y-2 overflow-y-auto  px-4 py-0 lg:px-0  lg:py-4">
              <CardDescription className="w-full  rounded-xl">
                <div className="relative  inset-x-0 mx-auto  flex w-full flex-col items-center justify-center">
                  <div className="relative mx-auto flex size-full items-center justify-center">
                    {(processedImage || objectUrl) && (
                      <>
                        <section
                          onClick={downloadImage}
                          className="absolute bottom-2 right-2 z-50 cursor-pointer rounded-full bg-gray-900/50 p-2 hover:bg-gray-900 lg:bottom-4 lg:right-4"
                        >
                          <Download className="size-5 font-bold text-slate-200" />
                        </section>
                      </>
                    )}

                    {processedImage ? (
                      <Image
                        src={processedImage}
                        className={cn([
                          activeTab === 'square-crop'
                            ? 'border-2 border-dashed border-blue-900/70 bg-transparent bg-clip-padding p-1'
                            : 'border border-solid border-slate-200 ',
                          'size-full object-cover',
                        ])}
                        width={0}
                        height={0}
                        alt="Processed Image"
                        sizes="100vw"
                      />
                    ) : (
                      objectUrl && <img src={objectUrl} className="size-full object-cover" alt="Original Image" />
                    )}
                  </div>
                  {fileRejections?.length > 0 && (
                    <div className="mx-auto flex  aspect-square size-full items-center justify-center self-center bg-slate-200">
                      <Ban className="mx-auto size-20 font-normal text-slate-400/60" />
                    </div>
                  )}
                </div>

                {fileRejections.map((fileRejection, index) => (
                  <Fragment key={index}>
                    <ErrorList errors={fileRejection.errors} />
                  </Fragment>
                ))}

                <FileList files={acceptedFiles as FileWithPath[]} />
              </CardDescription>
            </CardContent>

            {(processedImage || objectUrl) && (
              <CardFooter className="flex h-8 w-full items-center justify-center truncate  text-center text-lg font-medium tracking-wider text-slate-800">
                <span className="h-full items-center justify-center text-sm">{getNameEffect(activeTab)}</span>
              </CardFooter>
            )}
          </Card>
        </TabsContent>

        {(processedImage || objectUrl) && (
          <TabsList className="fixed inset-x-0 bottom-16 mx-auto flex h-16 w-full max-w-[400px]  flex-row items-center justify-center overflow-x-auto whitespace-nowrap">
            {listEffect.map(({ id, icon }) => (
              <TabsTrigger
                key={id}
                value={id}
                className="flex aspect-square size-12 items-center justify-center border-none md:size-16"
              >
                {icon}
              </TabsTrigger>
            ))}
          </TabsList>
        )}
      </Tabs>
      <canvas id="canvasOutput" style={{ display: 'none' }}></canvas>{' '}
    </>
  );
});

export default FilteredSection;
