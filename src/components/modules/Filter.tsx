"use client";

// import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CheckedState } from "@radix-ui/react-checkbox";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams, usePathname } from "next/navigation"; // Ganti ke next/navigation
import { MoveVertical } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Inputs = {
  description: string;
  location: string;
  full_time: boolean; // Ubah ke boolean
  remote: boolean; // Ubah ke boolean
};

interface PropsFilter {
  className?: string;
}

export function Filter({ className }: PropsFilter) {
  const form = useForm<Inputs>();
  const router = useRouter(); // Inisialisasi router
  const params = useSearchParams();
  const pathname = usePathname();

  const description = params.get("description") || "";
  const location = params.get("location") || "";
  const full_time = params.get("full_time") === "true"; // Ubah ke boolean

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    // Membuat URLSearchParams
    const params = new URLSearchParams(window.location.search);
    if (data?.description) {
      params.set("description", data.description);
    } else {
      params.delete("description");
    }

    if (data?.location) {
      params.set("location", data.location);
    } else {
      params.delete("location");
    }

    if (data?.full_time) {
      params.set("full_time", String(data.full_time)); // Ubah ke string
    } else {
      params.delete("full_time");
    }
    console.log("params", params.toString());

    // Update URL tanpa reload
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          "gap-5 bottom-0 z-50  bg-white shadow-md lg:shadow-none space-y-2 lg:space-y-0 right-0 left-0 fixed lg:relative lg:flex lg:flex-row flex-col items-center justify-start w-full px-4 lg:px-0 pt-4",
          className
        )}
      >
        {/* MOBILE */}
        <Accordion
          collapsible
          type="single"
          className="w-full flex right-0 lg:hidden bg-white z-50 px-0"
        >
          <AccordionItem value="search" className="w-full z-50">
            <AccordionTrigger className="text-xs py-4 justify-center gap-1  shadow-2xl no-underline font-bold ">
              Advance Search
            </AccordionTrigger>
            <AccordionContent className="flex gap-3 flex-col w-full lg:hidden ring-1 rounded-lg">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="w-full lg:w-4/12">
                    <FormControl>
                      <Input
                        startIcon={Search}
                        placeholder="Description, ex:python.."
                        {...field}
                        defaultValue={description} // Set default value
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem className="w-full lg:w-3/12">
                    <FormControl>
                      <Input
                        startIcon={MapPin}
                        placeholder="Location"
                        {...field}
                        defaultValue={location} // Set default value
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="full_time"
                render={({ field }) => (
                  <FormItem className="flex w-full lg:w-auto px-2 lg:px-0 flex-row gap-2 items-center justify-start rounded-lg border-none ">
                    <FormControl>
                      <Checkbox
                        checked={field.value as CheckedState}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>

                    <span className="h-full text-xs font-bold flex items-center pb-2 flex-row text-gray-800">
                      Full time only
                    </span>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="gap-1 w-full lg:w-auto px-5 text-xs hover:bg-gray-800"
                // onClick={() => updateDrawerFilter(false)}
              >
                <Search className="w-4 h-4 text-xs" /> Search
              </Button>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* DESKTOP */}
        <div className="hidden w-full gap-5 lg:flex ">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full lg:w-4/12">
                <FormControl>
                  <Input
                    startIcon={Search}
                    placeholder="Description, ex:python.."
                    {...field}
                    defaultValue={description} // Set default value
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="w-full lg:w-3/12">
                <FormControl>
                  <Input
                    startIcon={MapPin}
                    placeholder="Location"
                    {...field}
                    defaultValue={location} // Set default value
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="full_time"
            render={({ field }) => (
              <FormItem className="flex w-full lg:w-auto px-2 lg:px-0 flex-row gap-2 items-center justify-start rounded-lg border-none ">
                <FormControl>
                  <Checkbox
                    checked={field.value as CheckedState}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>

                <span className="h-full text-xs font-bold flex items-center pb-2 flex-row text-gray-800">
                  Full time only
                </span>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="gap-1 w-full lg:w-auto px-5 text-xs hover:bg-gray-800"
            // onClick={() => updateDrawerFilter(false)}
          >
            <Search className="w-4 h-4 text-xs" /> Search
          </Button>
        </div>
      </form>
    </Form>
  );
}
