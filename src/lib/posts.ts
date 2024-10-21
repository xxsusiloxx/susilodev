import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface PostData {
  id: string;
  title: string;
  date: string;
  tags: string[];
  content: string;
  thumbnail: string;
}

const postsDirectory = path.join(process.cwd(), 'posts');

// Mendapatkan data semua postingan yang diurutkan
export function getSortedPostsData(): PostData[] {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const { data, content } = matter(fileContents);

    return {
      id,
      title: data.title as string,
      date: data.date as string,
      tags: data.tags as string[],
      content,
      thumbnail: data.thumbnail as string,
    };
  });

  return allPostsData.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

// Mendapatkan semua ID postingan untuk routing dinamis
export function getAllPostIds(): { params: { id: string } }[] {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ''),
      },
    };
  });
}

// Mendapatkan data dari postingan berdasarkan ID
export function getPostData(id: string): PostData {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    id,
    title: data.title as string,
    date: data.date as string,
    tags: data.tags as string[],
    content,
    thumbnail: data.thumbnail as string,
  };
}
