"use client";

import { useMediaQuery } from "usehooks-ts";

import { Drawer, DrawerContent } from "@/components/ui/drawer";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import JobCard from "./JobCard";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState, Fragment } from "react";
import { useSearchParams } from "next/navigation"; // Ganti ke next/navigation
import DetailCard from "./DetailCard";

export function JobBoard() {
  const params = useSearchParams();

  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const description = params.get("description") || "";
  const location = params.get("location") || "";
  const full_time = params.get("full_time") || "";

  const fetchJobList = async ({ pageParam = 1 }) => {
    const params = new URLSearchParams();
    params.set("page", String(pageParam)); // Always include page

    if (description) params.set("description", description);
    if (location) params.set("location", location);
    if (full_time) params.set("full_time", full_time);

    const res = await fetch(
      `https://dev6.dansmultipro.com/api/recruitment/positions.json?${params.toString()}`
    );
    const data = await res.json();
    return {
      jobs: data,
      nextPage: data.length > 0 ? pageParam + 1 : undefined, // Menentukan halaman berikutnya
    };
  };

  const fetchJobDetail = async (jobId: string) => {
    const res = await fetch(
      `https://dev6.dansmultipro.com/api/recruitment/positions/${jobId}`
    );
    if (!res.ok) throw new Error("Error fetching job details");
    return await res.json();
  };

  const { data, fetchNextPage, hasNextPage, isFetching, isError } =
    useInfiniteQuery({
      queryKey: ["job-list", description, location], // Tambahkan query ke queryKey
      queryFn: fetchJobList,
      initialPageParam: 1,
      getNextPageParam: (lastPage) => lastPage.nextPage,
    });

  console.log("data indra", data);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isFetching || !hasNextPage) return;

    const callback = (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting) {
        fetchNextPage();
      }
    };

    observer.current = new IntersectionObserver(callback, {
      root: null, // Gunakan viewport sebagai root
      rootMargin: "0px",
      threshold: 1.0, // Trigger saat elemen sepenuhnya terlihat
    });

    if (lastItemRef.current) {
      observer.current.observe(lastItemRef.current);
    }

    return () => {
      if (lastItemRef.current) {
        observer?.current?.unobserve(lastItemRef?.current);
      }
    };
  }, [isFetching, hasNextPage, fetchNextPage]);

  const [drawerDetailsMobile, setDrawerDetailsMobile] = useState(false); // Tambahkan state untuk drawer

  const [selectedTab, setSelectedTab] = useState<string | null>(null); // Ubah tipe state menjadi string atau null

  useEffect(() => {
    if (data?.pages?.[0]?.jobs?.length) {
      setSelectedTab(data?.pages[0]?.jobs[0]?.id); // Set selectedTab ke id job pertama
    }
  }, [data]);

  const {
    data: jobDetail,
    refetch: refetchJobDetail,
    isLoading: isLoadingDetail,
  } = useQuery({
    queryKey: ["job-detail", selectedTab],
    queryFn: () => fetchJobDetail(selectedTab as string),
    enabled: !!selectedTab,
  });

  useEffect(() => {
    if (selectedTab) {
      refetchJobDetail(); // Ambil detail job saat selectedTab berubah
    }
  }, [selectedTab, refetchJobDetail]);

  return (
    <Fragment>
      {/* Mobile */}

      {/* Desktop */}
      <div className="flex w-full flex-row pt-4 mx-auto justify-center">
        <Tabs
          defaultValue={selectedTab as string}
          className="w-full flex flex-row h-screen bg-white gap-6"
        >
          <div className="w-full lg:w-4/12 pt-2">
            <TabsList className="flex flex-col justify-start items-start gap-6 w-full h-screen overflow-y-auto bg-white pb-24">
              {data?.pages?.map((page) =>
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                page?.jobs?.map((job: any, index: unknown) => {
                  const isLastItem = index === page.jobs.length - 1; // Cek item terakhir

                  if (!job?.title) return null;

                  return (
                    <Fragment key={job?.id}>
                      <TabsTrigger
                        value={job?.id}
                        className="w-full"
                        onClick={() => setSelectedTab(job.id)}
                      >
                        <JobCard
                          data={job}
                          onClick={() => {
                            isDesktop ? null : setDrawerDetailsMobile(true);
                          }}
                        />
                      </TabsTrigger>
                      {/* Tambahkan ref pada item terakhir */}
                      {isLastItem && <div ref={lastItemRef} />}{" "}
                    </Fragment>
                  );
                })
              )}

              {isFetching && !isError && (
                <Fragment>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div
                      key={index}
                      className="w-full gap-3 flex z-10 p-5 flex-col bg-slate-100"
                    >
                      <div className="h-5 bg-slate-400 w-11/12 animate-pulse"></div>
                      <div className="h-4 bg-slate-300 w-6/12 animate-pulse"></div>
                      <div className="h-3 bg-slate-300 w-5/12 animate-pulse"></div>
                      <div className="h-3 bg-slate-200 w-3/12 animate-pulse"></div>
                    </div>
                  ))}
                </Fragment>
              )}
            </TabsList>
          </div>
          <div className="hidden lg:flex w-6/12  flex-col h-full">
            {isLoadingDetail && (
              <div className="w-full gap-3 flex p-5 z-10 flex-col bg-slate-100">
                <div className="h-5 bg-slate-400 w-5/12 animate-pulse"></div>
                <div className="h-4 bg-slate-300 w-4/12 animate-pulse"></div>
                <div className="h-3 bg-slate-300 w-3/12 animate-pulse"></div>
                <div className="h-3 bg-slate-200 w-2/12 animate-pulse"></div>

                <div className="h-28 w-full bg-slate-200 mt-14 animate-pulse"></div>
                <div className="h-20 w-full bg-slate-200 mt-2 animate-pulse"></div>
                <div className="h-28 w-full bg-slate-200 mt-2 animate-pulse"></div>
              </div>
            )}
            {jobDetail?.title && (
              <Tabs
                value={selectedTab as string}
                className="flex w-full h-full overflow-y-auto"
              >
                <DetailCard data={jobDetail} />
              </Tabs>
            )}
          </div>
        </Tabs>
      </div>

      <Drawer
        direction="right"
        open={drawerDetailsMobile}
        onOpenChange={setDrawerDetailsMobile}
      >
        <DrawerContent className="h-4/5 flex lg:hidden">
          <DetailCard data={jobDetail} />
        </DrawerContent>
      </Drawer>
    </Fragment>
  );
}
