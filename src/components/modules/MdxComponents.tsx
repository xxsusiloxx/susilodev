import type { MDXComponents } from 'mdx/types';
import Image, { ImageProps } from 'next/image';

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including inline styles,
// components from other libraries, and more.

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Allows customizing built-in components, e.g. to add styling.
    h1: ({ children }) => <h1 className="pb-5 text-3xl font-bold text-gray-950">{children}</h1>,
    h2: ({ children }) => <h2 className="pb-4 text-2xl font-bold text-gray-950">{children}</h2>,
    h3: ({ children }) => <h3 className="pb-3 text-xl font-bold text-gray-950">{children}</h3>,
    h4: ({ children }) => <h4 className="pb-3 text-lg font-bold text-gray-950">{children}</h4>,
    h5: ({ children }) => <h5 className="pb-3 text-base font-bold text-gray-950">{children}</h5>,
    p: ({ children }) => <p className="text-base text-gray-900">{children}</p>,
    // code: ({ children }) => <code className="p-5">{children}</code>,
    ...components,
  };
}
