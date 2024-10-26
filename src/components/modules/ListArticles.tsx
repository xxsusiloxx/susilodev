'use client';

import { PostData } from '@/lib/posts';
import Image from 'next/image';
import Link from 'next/link';
import { useId } from 'react';

export default function ListArticles({ data }: { data: PostData[] }) {
  const listId = useId();

  return (
    <div>
      <ul className="space-y-10">
        {data?.map((x) => {
          return (
            <Link href={`/blog/${x.slug}`} key={listId}>
              <li
                key={listId}
                className="flex h-full cursor-pointer flex-row items-start justify-start space-x-5  border-b border-solid border-slate-200/80 py-3 hover:border-slate-300"
              >
                {/* Images */}

                <section className=" flex h-full w-9/12 flex-col  justify-between space-y-2">
                  <h2 className="line-clamp-2 text-xl font-bold text-gray-800">{x.title}</h2>
                  <div className="line-clamp-3 text-lg font-light text-slate-400">
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Possimus debitis doloribus illo, inventore
                    maiores eos accusamus obcaecati architecto eius deserunt, soluta ab. Ratione maiores cumque
                    quibusdam nulla, quaerat tempore fugit!
                  </div>
                  <div className="flex flex-col justify-end">
                    <ul className="flex grow flex-row gap-4">
                      {x.tags?.map((x) => {
                        return (
                          <li
                            className="cursor-pointer  p-1 text-sm font-medium text-slate-400 hover:text-gray-950"
                            key={listId}
                          >
                            #{x}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </section>

                <section className="aspect-square h-auto w-3/12 ">
                  <Image
                    className="size-full object-cover"
                    src={x.thumbnail}
                    alt={`img ${x.title}`}
                    width="100"
                    height="100"
                  />
                </section>
              </li>
            </Link>
          );
        })}
      </ul>
    </div>
  );
}
