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
  <div className="text-2xl font-bold flex justify-center items-center h-8 w-8">{simbol}</div>
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
    icon: <Highlighter className="h-6 w-6 font-normal" />,
  },

  {
    id: 'rusian-beauty',
    name: 'Rusian Beauty',
    icon: <Sparkles className="h-6 w-6 font-normal" />,
  },
  {
    id: 'square-crop',
    name: 'Forcesquare Crop',
    icon: <CropIcon className="h-6 w-6 font-normal" />,
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
  <ul className="flex flex-col gap-1 mt-2 mb-5">
    {files.map((file: FileWithPath) => (
      <li key={file.path} className="italic font-mono text-[0.65rem] truncate text-start text-slate-500">
        <span className="bg-blue-50 text-slate-500 px-2 py-1  truncate rounded-sm">{file.path}</span>
      </li>
    ))}
  </ul>
);

const ErrorList = ({ errors }: { errors: Array<{ code: string; message: string }> }) => (
  <ul className="text-red-500 text-xs font-mono my-2 mb-3 italic">
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
              'flex border-none absolute bg-transparent shadow-none left-0  right-0 flex-col p-0 justify-end w-full max-w-[400px] mx-auto',
              Boolean(processedImage || objectUrl) ? 'bottom-32' : 'bottom-12',
            ])}>
            <CardContent className="w-full px-4 py-0 lg:px-0 lg:py-4 h-auto space-y-2 flex flex-col  justify-center mx-auto items-center  overflow-y-auto">
              <CardDescription className="rounded-xl  w-full">
                <div className="relative  flex justify-center  items-center w-full flex-col mx-auto left-0 right-0">
                  <div className="relative mx-auto justify-center flex items-center w-full h-full">
                    {(processedImage || objectUrl) && (
                      <>
                        <section
                          onClick={downloadImage}
                          className="absolute right-2 z-50 lg:right-4 bottom-2 lg:bottom-4 rounded-full p-2 bg-gray-900/50 cursor-pointer hover:bg-gray-900">
                          <Download className="w-5 h-5 text-slate-200 font-bold" />
                        </section>
                      </>
                    )}

                    {processedImage ? (
                      <Image
                        src={processedImage}
                        className={cn([
                          activeTab === 'square-crop'
                            ? 'bg-clip-padding p-1 bg-transparent border-2 border-blue-900/70 border-dashed'
                            : 'border-solid border-slate-200 border-[1px] ',
                          'h-full w-full object-cover',
                        ])}
                        width={0}
                        height={0}
                        alt="Processed Image"
                        sizes="100vw"
                      />
                    ) : (
                      objectUrl && <img src={objectUrl} className="h-full object-cover w-full" alt="Original Image" />
                    )}
                  </div>
                  {fileRejections?.length > 0 && (
                    <div className="w-full mx-auto  h-full bg-slate-200 flex self-center justify-center items-center aspect-square">
                      <Ban className="w-20 h-20 mx-auto text-slate-400/60 font-normal" />
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
              <CardFooter className="w-full flex truncate h-8 justify-center text-center  items-center font-medium text-slate-800 text-lg tracking-wider">
                <span className="h-full text-sm justify-center items-center">{getNameEffect(activeTab)}</span>
              </CardFooter>
            )}
          </Card>
        </TabsContent>

        {(processedImage || objectUrl) && (
          <TabsList className="flex h-16 fixed bottom-16 max-w-[400px] mx-auto right-0 left-0  justify-center items-center flex-row w-full overflow-x-auto whitespace-nowrap">
            {listEffect.map(({ id, icon }) => (
              <TabsTrigger
                key={id}
                value={id}
                className="border-none aspect-square w-12 h-12 md:w-16 md:h-16 items-center justify-center flex">
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
