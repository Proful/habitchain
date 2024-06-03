import type { MetaFunction } from '@remix-run/node'
import { ClientLoaderFunctionArgs, Link, useLoaderData } from '@remix-run/react'
import { Separator } from '~/components/ui/separator'
import { Button } from '~/components/ui/button'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '~/components/ui/alert-dialog'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Link2Icon, Mail } from 'lucide-react'
import { Textarea } from '~/components/ui/textarea'
import { useState } from 'react'

export const meta: MetaFunction = () => {
  return [{ title: 'View Post' }, { name: 'description', content: 'View Post' }]
}

export async function clientLoader({ params }: ClientLoaderFunctionArgs) {
  const response = await fetch(`http://localhost:3000/posts/${params.postId}`)
  const data = await response.json()
  return data
}

export default function ViewPost() {
  const data = useLoaderData<typeof clientLoader>()
  const [message, setMessage] = useState('')

  async function handleSubmit() {
    const token = localStorage.getItem('credential')
    const response = await fetch('http://localhost:3000/messages', {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: new Headers({
        'content-type': 'application/json',
        authorization: `Bearer ${token}`,
      }),
      body: JSON.stringify({
        message: message,
        receiver_id: data.user_id,
      }),
    })
    let x = await response.json()
    console.log('x', x)
  }
  return (
    <div className="m-16 w-3/6 mx-auto">
      <Card>
        <span className="aspect-[1200/630] overflow-hidden rounded-t-lg">
          <img
            src={data.img_url}
            width={1200}
            height={630}
            loading="eager"
            className="aspect-[1200/630] animate-reveal rounded-t-lg border bg-cover bg-center bg-no-repeat object-cover"
          />
        </span>
        <CardHeader>
          <CardTitle>
            {data.name}
            <span className="line-clamp-4 inline-flex items-center gap-1 text-sm text-muted-foreground ml-2">
              <Link2Icon size={16} />
              {data.website}
            </span>
          </CardTitle>
          <CardDescription>{data.title}</CardDescription>
        </CardHeader>
        <CardContent>
          <Separator className="mb-4" />
          <div className="flex mt-4">
            <div className="flex-none pr-4 w-4/6">
              <div className="flex">
                <Avatar>
                  <AvatarImage src="https://github.com/Proful.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="ml-4 mt-1">
                  <span>{data.user_name}</span>
                </div>
              </div>
              <p className="mt-4">{data.description}</p>
            </div>
            <div className="flex-none w-2/6">
              <Link to={data.affiliate_link} target="_blank">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-normal">
                      Affiliate Commision
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {data.affiliate_pc}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Partner with us to earn more
                    </p>
                  </CardContent>
                </Card>
              </Link>
              <div className="mt-2">
                <AlertDialog>
                  <AlertDialogTrigger>
                    <span className="mt-4">
                      <Mail className="mr-2 inline" /> Contact Founder
                    </span>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Send message to founder
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        <div>
                          <Textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                          />
                          <div className="text-xs text-muted-foreground mt-2">
                            Note: Your email will be shared with founder. So
                            that he can contact you.
                          </div>
                        </div>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleSubmit()}>
                        Submit
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
