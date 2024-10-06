import Image from "next/image";
import { saveAs } from "file-saver";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Download,
  Ban,
  Highlighter,
  Sparkles,
  Crop as CropIcon,
} from "lucide-react";
import React, {
  Fragment,
  useState,
  useEffect,
  useLayoutEffect,
  memo,
} from "react";
import { FileRejection } from "react-dropzone";
import cv from "opencv-ts"; // Import OpenCV
import { cn } from "@/lib/utils";

/**
 * A small icon component that displays a symbol.
 * @param {{ simbol: string }} props
 * @prop {string} simbol - The symbol to display
 * @returns {JSX.Element}
 */
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
    name: " Square Crop",
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
      <div
        className="flex flex-row w-full justify-end gap-1 mt-2 my-3"
        key={file.path}
      >
        <p className=" italic font-mono max-w-full text-[0.65rem] truncate text-start text-slate-500 ">
          {file.path}
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

      try {
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
            cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
            break;

          case "rusian-beauty":
            cv.cvtColor(src, src, cv.COLOR_RGBA2RGB, 0);
            cv.bilateralFilter(src, dst, 9, 75, 100, cv.BORDER_DEFAULT);
            break;

          case "square-crop":
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
      const imgElement = document.createElement("img");
      imgElement.src = objectUrl;

      imgElement.onload = () => {
        const src = cv.imread(imgElement);
        const dst = applyEffect(src);

        const canvas = document.querySelector(
          "#canvasOutput"
        ) as HTMLCanvasElement;
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
      <Tabs
        defaultValue="normal"
        onValueChange={(value) => setActiveTab(value)}
      >
        <TabsContent value={activeTab} className="">
          <Card className="flex border-none absolute bottom-32 left-0 right-0 flex-col p-0 justify-end w-full max-w-[400px] mx-auto">
            <CardContent className="w-full h-auto space-y-2 flex flex-col overflow-y-auto">
              <CardTitle></CardTitle>
              <CardDescription className="gap-2 pb-2 rounded-xl">
                {fileRejections.map(({ file, errors }: any) => (
                  <Fragment key={file.path}>
                    <ErrorList errors={errors} />
                  </Fragment>
                ))}
                <div className="relative">
                  <div className="relative w-full h-full">
                    {(processedImage || objectUrl) && (
                      <>
                        <section
                          onClick={downloadImage}
                          className="absolute right-3 z-50 lg:right-4 bottom-3 lg:bottom-4 rounded-full p-2 bg-gray-900/60 cursor-pointer hover:bg-gray-900"
                        >
                          <Download className="w-5 h-5 text-slate-200 font-bold" />
                        </section>
                      </>
                    )}

                    {processedImage ? (
                      <Image
                        src={processedImage}
                        className={cn([
                          activeTab === "square-crop" &&
                            "bg-clip-padding p-1 bg-transparent border-2 border-blue-900/70 border-dashed",
                          "h-full w-full object-cover",
                        ])}
                        width={0}
                        height={0}
                        alt="Processed Image"
                        sizes="100vw"
                      />
                    ) : (
                      objectUrl && (
                        <img
                          src={objectUrl}
                          className="h-full object-cover w-full"
                          alt="Original Image"
                        />
                      )
                    )}
                  </div>
                  {fileRejections.length > 0 && (
                    <div className="w-full  h-full bg-slate-200 flex justify-center items-center aspect-square">
                      <Ban className="w-20 h-20 text-slate-400/60 font-normal" />
                    </div>
                  )}
                </div>

                <FileList files={acceptedFiles} />
              </CardDescription>
            </CardContent>

            {(processedImage || objectUrl) && (
              <CardFooter className="w-full flex justify-center text-center  items-center font-medium text-slate-800 text-lg tracking-wider">
                <span className="h-full text-sm justify-center items-center">
                  {getNameEffect(activeTab)}
                </span>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
        <TabsList className="flex h-16 fixed bottom-16 max-w-[400px] mx-auto right-0 left-0  justify-center items-center flex-row w-full overflow-x-auto whitespace-nowrap">
          {(processedImage || objectUrl) &&
            listEffect.map(({ id, icon }) => (
              <TabsTrigger
                key={id}
                value={id}
                className="border-none aspect-square w-12 h-12 md:w-16 md:h-16 items-center justify-center flex"
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
