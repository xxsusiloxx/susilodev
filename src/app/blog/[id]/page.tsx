import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote/rsc'; // Import the remote component renderer
import { useMDXComponents } from '@/components/modules/MdxComponents';
import '@/styles/highlight-js/one-dark.css';
import '@/styles/highlight-js/additional-hightlight.css';

import rehypeHighlight from 'rehype-highlight';
import rehypeSanitize from 'rehype-sanitize';

import Head from 'next/head';

const options = {
  mdxOptions: {
    remarkPlugins: [],
    rehypePlugins: [rehypeSanitize, rehypeHighlight],
  },
};

// Path to the 'markdown' directory
const postsDirectory = path.join(process.cwd(), 'src/markdown');

// Fungsi untuk membaca file MDX berdasarkan ID
async function getPostData(id: string): Promise<{
  title: string;
  desc: string;
  id: string;
  content: string;
  slug: string;
  thumbnail: string;
  mini_thumbnail: string;
} | null> {
  const fullPath = path.join(postsDirectory, `${id}.mdx`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const { title, desc, slug, thumbnail, mini_thumbnail } = data;

  return {
    id,
    title,
    mini_thumbnail,
    thumbnail,
    slug,
    desc,
    content,
  };
}

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const post = await getPostData(params.id);

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'This post could not be found.',
    };
  }

  return {
    title: post.title, // Set title from data or fallback
    description: post.desc, // Set description from data or fallback
    authors: [
      {
        name: 'Indra Susila',
        url: 'https://susilo.dev',
      },
    ],
  };
}

// Halaman dinamis berdasarkan 'id'
export default async function BlogPostPage({ params }: { params: { id: string } }) {
  const post = await getPostData(params.id);

  if (!post) {
    notFound(); // Tampilkan halaman 404 jika file tidak ditemukan
  }

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300..700&display=swap" rel="stylesheet" />

        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.desc} />
        <meta property="og:image" content={`${process.env.NEXT_PUBLIC_URL}/${post.thumbnail}`} />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_URL}/blog/${post.slug}`} />
        <meta property="og:type" content="article" />
      </Head>
      <article>
        <MDXRemote source={post.content} components={useMDXComponents({})} options={options} />
      </article>
    </>
  );
}
