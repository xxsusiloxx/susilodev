import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';

export interface PostData {
  id: string;
  title: string;
  slug: string;
  date: string;
  tags: string[];
  content: MDXRemoteSerializeResult;
  thumbnail: string;
  mini_thumbnail: string;
  desc: string;
}

const postsDirectory = path.join(process.cwd(), 'src/markdown');

// Get all sorted posts
export async function getSortedPostsData(): Promise<PostData[]> {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = await Promise.all(
    fileNames.map(async (fileName) => {
      const id = fileName.replace(/\.mdx$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      const { data, content } = matter(fileContents);
      const mdxSource = await serialize(content);

      return {
        id,
        title: data.title as string,
        slug: data.slug as string,
        date: data.date as string,
        tags: data.tags as string[],
        content: mdxSource,
        thumbnail: data.thumbnail as string,
        mini_thumbnail: data.mini_thumbnail as string,
        desc: data.desc as string,
      };
    }),
  );

  return allPostsData.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

// Get all post ids
export function getAllPostIds(): { params: { id: string } }[] {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.mdx$/, ''),
      },
    };
  });
}

// Get post data by ID
export async function getPostData(id: string): Promise<PostData> {
  const fullPath = path.join(postsDirectory, `${id}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const { data, content } = matter(fileContents);
  const mdxSource = await serialize(content);

  return {
    id,
    title: data.title as string,
    date: data.date as string,
    tags: data.tags as string[],
    slug: data.slug as string,
    content: mdxSource,
    desc: data.desc as string,
    thumbnail: data.thumbnail as string,
    mini_thumbnail: data.mini_thumbnail as string,
  };
}
