import { getSortedPostsData } from '../lib/posts';
import ListArticles from '@/components/modules/ListArticles';
import { BriefcaseBusiness, Github, Twitter } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  date: string;
  tags: string[];
  content: string;
}

interface HomeProps {
  posts: Post[];
}

const Icons = [
  {
    name: 'github',
    label: 'Github',
    url: 'https://github.com/xxsusiloxx',
    icon: <Github className="cursor-pointer font-thin text-slate-400 hover:text-gray-700" />,
  },
  {
    name: 'linkedin',
    label: 'Linkedin',
    url: 'https://www.linkedin.com/in/indra-susila/',
    icon: <Twitter className="cursor-pointer font-thin text-slate-400 hover:text-gray-700" />,
  },
  {
    name: 'X',
    label: 'X',
    url: 'https://x.com/xxsusiloxx',
    icon: <BriefcaseBusiness className="cursor-pointer font-thin text-slate-400 hover:text-gray-700" />,
  },
];

const Home: React.FC<HomeProps> = async () => {
  const data = await getSortedPostsData();

  console.log('data', data);

  return (
    <main className="flex h-screen w-full flex-row gap-8">
      <section className="w-7/12 overflow-y-auto">
        <h2 className="py-5 text-2xl font-light text-slate-400">Latest</h2>
        <ListArticles data={data} />
      </section>

      <aside className="flex w-5/12 flex-col items-end justify-center gap-y-2">
        <section className="size-auto bg-gray-700 px-2 py-1 pr-4 font-mono text-2xl font-light text-white">
          <h1>
            susilo.dev <i className="-ml-3 animate-pulse duration-500">_</i>
          </h1>
        </section>

        <section className="mt-3">
          <p className="text-right text-xl font-medium">Software Engineer</p>
        </section>

        <section>
          <p className="text-right text-lg font-light text-slate-400">
            I build pixel-perfect, engaging, and accessible digital experiences.
          </p>
        </section>

        <footer className="mt-10 flex w-full flex-row justify-end gap-x-4">
          <ul className="flex flex-row gap-2">
            {Icons.map((x) => {
              return (
                <div className="size-10" key={x.label}>
                  {x.icon}
                </div>
              );
            })}
          </ul>
        </footer>
      </aside>
    </main>
  );
};

export default Home;
