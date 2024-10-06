import Image from "next/image";
import { saveAs } from "file-saver";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Download,
  Ban,
  Highlighter,
  Sparkles,
  Crop as CropIcon,
} from "lucide-react";
import React, { Fragment, useState, useEffect, memo } from "react";
import { FileRejection } from "react-dropzone";
import cv from "opencv-ts"; // Import OpenCV
import { bytesToSize } from "@/lib/utils";

const Icon = ({ simbol }: { simbol: string }) => (
  <div className="text-2xl font-bold flex justify-center items-center h-8 w-8">
    {simbol}
  </div>
);

const downloadImage = () => {
  const canvas = document.querySelector("#canvasOutput") as HTMLCanvasElement;
  if (canvas) {
    canvas.toBlob((blob) => {
      if (blob) {
        saveAs(blob, `processed-${Date.now()}.png`); // Save the blob as a file
      }
    });
  }
};

const listEffect = [
  { id: "normal", name: "Normal", icon: <Icon simbol="N" /> },
  {
    id: "grayscale",
    name: "Grayscale",
    icon: <Icon simbol="G" />,
  },
  {
    id: "graybold",
    name: "Graybold",
    icon: <Highlighter className="h-6 w-6 font-normal" />,
  },

  {
    id: "rusian-beauty",
    name: "Rusian Beauty",
    icon: <Sparkles className="h-6 w-6 font-normal" />,
  },
  {
    id: "square-crop",
    name: "Centering Square Crop",
    icon: <CropIcon className="h-6 w-6 font-normal" />,
  },
];

function getNameEffect(id: string): React.ReactNode {
  const findEffect = listEffect.find((effect) => effect.id === id);
  if (findEffect) {
    return findEffect.name;
  }
  return "-";
}

interface FilterProps {
  acceptedImg?: Blob | null;
  acceptedFiles: File[];
  fileRejections: FileRejection[];
}

const FileList = ({ files }: { files: File[] }) => (
  <>
    {files.map((file: any) => (
      <div className="flex flex-col gap-1 mt-2 my-3" key={file.path}>
        <p className="font-mono text-xs truncate">File: {file.path}</p>
        <p className="font-mono text-xs truncate">
          size: {bytesToSize(file.size)}
        </p>
      </div>
    ))}
  </>
);

const ErrorList = ({ errors }: { errors: any[] }) => (
  <ul>
    {errors.map((e) => (
      <li className="text-red-500 text-xs font-mono myt-1 mb-3" key={e.code}>
        {e.message}
      </li>
    ))}
  </ul>
);

const FilteredSection = memo(function FilteredSection({
  acceptedImg,
  acceptedFiles,
  fileRejections,
}: FilterProps) {
  const [activeTab, setActiveTab] = useState("normal");
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
    const applyEffect = (src: any) => {
      let dst = new cv.Mat();

      switch (activeTab) {
        case "graybold":
          // Apply graybold effect
          cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY);
          cv.medianBlur(src, src, 7);
          const edges = new cv.Mat();
          cv.adaptiveThreshold(
            src,
            edges,
            255,
            cv.ADAPTIVE_THRESH_MEAN_C,
            cv.THRESH_BINARY,
            9,
            2
          );
          const color = new cv.Mat();
          cv.bilateralFilter(src, color, 9, 75, 75, cv.BORDER_DEFAULT);
          cv.bitwise_and(color, color, dst, edges);
          edges.delete();
          color.delete();
          break;

        case "grayscale":
          // Apply grayscale effect
          cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
          break;

        case "rusian-beauty":
          // Apply rusian beauty effect
          cv.cvtColor(src, src, cv.COLOR_RGBA2RGB, 0);
          cv.bilateralFilter(src, dst, 9, 75, 100, cv.BORDER_DEFAULT);

          break;

        case "square-crop":
          // Perform square crop
          const srcHeight = src.rows;
          const srcWidth = src.cols;
          const size = Math.min(srcHeight, srcWidth); // Square size, minimum of width and height
          const x = Math.floor((srcWidth - size) / 2); // Center X
          const y = Math.floor((srcHeight - size) / 2); // Center Y
          const rect = new cv.Rect(x, y, size, size);
          dst = src.roi(rect); // Crop the region of interest (ROI)
          break;

        default:
          cv.cvtColor(src, dst, cv.COLOR_RGBA2BGR);
          break;
      }

      return dst;
    };

    if (activeTab !== "normal" && objectUrl) {
      const imgElement = document.createElement("img");
      imgElement.src = objectUrl;

      imgElement.onload = () => {
        const src = cv.imread(imgElement);
        const dst = applyEffect(src);

        // Set processed image URL
        const canvas = document.querySelector(
          "#canvasOutput"
        ) as HTMLCanvasElement;
        if (canvas) {
          cv.imshow(canvas, dst); // show image to canvas
          setProcessedImage(canvas.toDataURL()); // convert canvas to image Url
        } else {
          console.error("Canvas element not found");
        }

        // Cleanup
        src.delete();
        dst.delete();
      };
    } else {
      setProcessedImage(null); // Reset when not choosen
    }
  }, [activeTab, objectUrl]);

  return (
    <>
      <Tabs
        defaultValue="normal"
        onValueChange={(value) => setActiveTab(value)}
      >
        <TabsContent value={activeTab} className="">
          <Card className="flex border-none absolute bottom-32 left-0 right-0 flex-col p-0 justify-end w-full">
            <CardContent className="w-full h-auto space-y-2 flex flex-col">
              <CardDescription className="gap-2 pb-4 rounded-xl">
                <FileList files={acceptedFiles} />
                {fileRejections.map(({ file, errors }: any) => (
                  <Fragment key={file.path}>
                    <ErrorList errors={errors} />
                  </Fragment>
                ))}
                <div className="relative">
                  {Boolean(processedImage || objectUrl) && (
                    <>
                      <section
                        onClick={downloadImage}
                        className="absolute right-4 bottom-4 rounded-full p-2 bg-gray-900/60  cursor-pointer hover:bg-black"
                      >
                        <Download className="w-5 h-5 text-slate-200 font-bold" />
                      </section>
                    </>
                  )}

                  {processedImage ? (
                    <Image
                      src={processedImage}
                      className="w-full object-cover h-full aspect-square"
                      alt="Processed Image"
                      height={400}
                      width={400}
                      loading="lazy"
                    />
                  ) : (
                    objectUrl && (
                      <Image
                        src={objectUrl}
                        className="w-full object-cover h-full aspect-square"
                        alt="Original Image"
                        height={400}
                        width={400}
                        loading="lazy"
                      />
                    )
                  )}

                  {fileRejections.length > 0 && (
                    <div className="w-full  h-full bg-slate-200 flex justify-center items-center aspect-square">
                      <Ban className="w-20 h-20 text-slate-400/60 font-normal" />
                    </div>
                  )}
                </div>
              </CardDescription>
            </CardContent>

            {(processedImage || objectUrl) && (
              <CardFooter className="w-full flex justify-center text-center  items-center font-medium text-slate-800 text-lg tracking-wider">
                <span className="h-full justify-center items-center">
                  {getNameEffect(activeTab)}
                </span>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
        <TabsList className="flex h-16 fixed bottom-16 right-0 left-0 items-center justify-center flex-row w-full overflow-x-auto whitespace-nowrap">
          {(processedImage || objectUrl) &&
            listEffect.map(({ id, icon }) => (
              <TabsTrigger
                key={id}
                value={id}
                className="inline-block border-none"
              >
                {icon}
              </TabsTrigger>
            ))}
        </TabsList>
      </Tabs>
      <canvas id="canvasOutput" style={{ display: "none" }}></canvas>{" "}
    </>
  );
});

export default FilteredSection;
