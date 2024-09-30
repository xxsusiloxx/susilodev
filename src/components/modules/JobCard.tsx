import React from "react";
import { relativeTime } from "@/lib/utils";

interface JobcardData {
  title?: string;
  company?: string;
  location?: string;
  type?: string;
  created_at: string;
}

interface PropsCard {
  data: JobcardData;
  onClick?: () => void;
}
export default function JobCard({ data, onClick }: PropsCard) {
  //   console.log("propsy:", data);
  if (data?.title) {
    return (
      <div
        onClick={onClick}
        className="flex w-full  justify-start items-start flex-col text-black gap-1 p-3 lg:rounded-sm cursor-pointer shadown-2xl ring-slate-300 rounded-lg"
      >
        <p className="font-bold text-start text-lg text-gray-800 line-clamp-2 overflow-hidden overflow-ellipsis whitespace-normal">
          {data?.title}
        </p>
        <p className="font-medium  text-gray-600 text-start text-sm line-clamp-1 overflow-hidden overflow-ellipsis whitespace-normal">
          {data?.company}
        </p>
        <p className="font-bold text-gray-600 text-start text-xs line-clamp-1">
          {data?.location}, {data?.type}
        </p>

        <p className="font-normal text-start pt-3 text-gray-500 text-xs">
          {relativeTime(data?.created_at)}
        </p>
      </div>
    );
  }
  return null;
}
