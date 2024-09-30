import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DOMPurify from "dompurify";
import { relativeTime } from "@/lib/utils";

interface DetailCardProps {
  title?: string;
  location?: string;
  created_at?: string;
  type?: string;
  description?: string;
  company?: string;
  how_to_apply?: string;
  url?: string;
  company_logo?: string;
  company_url?: string;
}

export default function DetailCard({
  data,
  ...props
}: {
  data: DetailCardProps;
}) {
  return (
    <Card
      {...props}
      className="w-full h-full flex flex-col overflow-y-auto pb-10"
    >
      <CardHeader className="flex justify-between flex-row w-full bg-gradient-to-b  from-gray-50 to-white">
        <section className="w-auto">
          <CardTitle className="text-2xl">{data?.title}</CardTitle>
          <CardDescription className="text-sm mt-1 font-medium text-gray-800">
            {data?.location}, {data?.type}
          </CardDescription>
          <CardDescription className="text-sm mt-1 font-normal">
            {data?.company}
          </CardDescription>
          <CardDescription className="mt-1 italic text-gray-800 cursor-pointer">
            <a href={data?.company_url} target="_blank">
              {data?.company_url}{" "}
            </a>
          </CardDescription>

          <CardDescription className="mt-2">
            {relativeTime(data?.created_at as string)}
          </CardDescription>
        </section>

        <section className="w-2/12 lg:w-4/12 flex justify-end">
          <Avatar>
            <AvatarImage
              src={data?.company_logo}
              alt="company logo"
              className="w-full h-auto "
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </section>
      </CardHeader>
      <CardContent className="space-y-2 pt-8">
        <div
          className="font-sans space-y-2 "
          dangerouslySetInnerHTML={{
            __html: DOMPurify?.sanitize(data?.description || "--"),
          }}
        />
      </CardContent>
      <CardFooter>
        <section className="w-full flex flex-col bg-slate-900 pb-10 lg:pr-10 rounded-tr-3xl md:rounded-tr-full cursor-pointer hover:bg-gray-900 px-3 py-5 mt-4 gap-3 rounded-lg">
          <p className=" font-bold text-base text-white">How to Apply</p>
          <div
            className="font-sans space-y-2 apply-form text-white text-xs w-full lg:w-8/12"
            dangerouslySetInnerHTML={{
              __html: DOMPurify?.sanitize(data?.how_to_apply as string),
            }}
          />
          <p className="text-xs text-white w-full lg:w-10/12">
            or Apply directly at <a className="underline italic">{data?.url}</a>
          </p>
        </section>
        {/* <Button className="w-full lg:w-auto lg:px-8 my-5">Apply</Button> */}
      </CardFooter>
    </Card>
  );
}
