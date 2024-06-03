import type { MetaFunction } from '@remix-run/node'
import { useLoaderData, useNavigate } from '@remix-run/react'
import { Link } from '@remix-run/react'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import { Link2Icon } from 'lucide-react'

export const meta: MetaFunction = () => {
  return [{ title: 'Dashboard' }, { name: 'description', content: 'Dashboard' }]
}

export async function clientLoader() {
  const token = localStorage.getItem('credential')
  const response = await fetch(`http://localhost:3000/posts/users`, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: new Headers({
      'content-type': 'application/json',
      authorization: `Bearer ${token}`,
    }),
  })
  const data = await response.json()
  return data
}

export default function Dashboard() {
  const data = useLoaderData<typeof clientLoader>()
  const navigate = useNavigate()

  async function deletePost(postId: number) {
    const token = localStorage.getItem('credential')
    const response = await fetch(`http://localhost:3000/posts/${postId}`, {
      method: 'DELETE',
      headers: new Headers({
        'content-type': 'application/json',
        authorization: `Bearer ${token}`,
      }),
    })
    const data = await response.json()
    // console.log('first', first)
    navigate('/dashboard')
  }

  return (
    <div className="mx-24 my-8">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Dashboard
      </h1>
      <div className="my-4">
        <Button asChild>
          <Link to="/posts/new">New Post</Link>
        </Button>
      </div>
      <Separator className="my-4" />
      {data.posts.map((post: any) => (
        <div key={post.id} className="my-2">
          <h4 className="scroll-m-20 text-lg font-medium tracking-tight">
            <Link to={`/posts/${post.id}`} className="mr-2">
              {post.name}
              <span className="line-clamp-4 inline-flex items-center gap-1 text-sm text-muted-foreground ml-2">
                <Link2Icon size={16} />
                {post.website}
              </span>
            </Link>
            <Button variant="outline" className="mr-2" asChild>
              <Link to={`/posts/edit/${post.id}`}>Edit</Link>
            </Button>
            <Button variant="outline" onClick={() => deletePost(post.id)}>
              Delete
            </Button>
          </h4>
        </div>
      ))}
    </div>
  )
}
