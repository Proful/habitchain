import type { MetaFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Separator } from '~/components/ui/separator'
import { Link2Icon } from 'lucide-react'

export const meta: MetaFunction = () => {
  return [{ title: 'List Post' }, { name: 'description', content: 'List Post' }]
}

export async function clientLoader() {
  const response = await fetch(`http://localhost:3000/posts`)
  const data = await response.json()
  return data
}

export default function ListPost() {
  const data = useLoaderData<typeof clientLoader>()
  return (
    <div className="mx-24 my-8">
      <div
        className={
          'grid grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-4 place-content-start'
        }
      >
        {data.posts.map((post: PostProps) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}

interface PostProps {
  id: number
  name: string
  website: string
  img_url: string
  description: string
  usere: {
    name: string
  }
}

function Post({ post }: { post: PostProps }) {
  return (
    <a
      className="thumbnail-shadow flex aspect-auto min-w-0 cursor-pointer flex-col gap-4 overflow-hidden rounded-xl bg-white p-4 transition-colors duration-300 hover:bg-gray-100"
      href={`/posts/${post.id}`}
      rel="noopener noreferrer"
    >
      <span className="aspect-[1200/630] overflow-hidden rounded-lg">
        <img
          src={post.img_url}
          width={1200}
          height={630}
          loading="eager"
          className="aspect-[1200/630] animate-reveal rounded-lg border bg-cover bg-center bg-no-repeat object-cover transition-all hover:scale-105"
        />
      </span>
      <div className="flex flex-col gap-1">
        <h2 className="line-clamp-4 text-lg leading-snug">{post.name}</h2>
        <span className="line-clamp-4 inline-flex items-center gap-1 text-sm text-gray-500">
          <Link2Icon size={16} />
          {post.website}
        </span>
        <span className="line-clamp-6 text-sm">{post.description}</span>
      </div>
    </a>
  )
}
