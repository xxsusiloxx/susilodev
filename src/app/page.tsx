// import { DrawerFilter } from "@/components/modules/DrawerFilter";
import { Filter } from "@/components/modules/Filter";
import { JobBoard } from "@/components/modules/JobBoard";
import SessionGuard from "@/components/modules/SessionGuard";

export default function Home() {
  return (
    <div className="w-full flex flex-col mx-auto max-w-[1350px]">
      <SessionGuard />
      <Filter />
      <JobBoard />
    </div>
  );
}
