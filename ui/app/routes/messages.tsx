import type { MetaFunction } from '@remix-run/node'
import { useLoaderData, useNavigate } from '@remix-run/react'
import { Link } from '@remix-run/react'
import { Separator } from '~/components/ui/separator'
import { Mail } from 'lucide-react'

export const meta: MetaFunction = () => {
  return [{ title: 'Messages' }, { name: 'description', content: 'Messages' }]
}

export async function clientLoader() {
  const token = localStorage.getItem('credential')
  const response = await fetch(`http://localhost:3000/messages/users`, {
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

export default function Messages() {
  const data = useLoaderData<typeof clientLoader>()
  const navigate = useNavigate()

  return (
    <div className="mx-24 my-8">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Messages
      </h1>
      <Separator className="my-4" />
      {data.messages.map((message: any) => (
        <div key={message.id} className="my-2">
          <h4 className="scroll-m-20 text-lg font-medium tracking-tight">
            <p>{message.message}</p>
            <p className="line-clamp-4 inline-flex items-center gap-1 text-sm text-muted-foreground">
              by {message.sender_name}
              <Link
                to={`mailto://${message.sender_email}`}
                className="inline-flex"
              >
                <Mail size={16} className="mr-1 ml-2" />
                {message.sender_email}
              </Link>
            </p>
          </h4>
        </div>
      ))}
    </div>
  )
}
