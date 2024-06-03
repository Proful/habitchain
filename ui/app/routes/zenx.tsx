import type { MetaFunction } from '@remix-run/node'
import { Button } from '~/components/ui/button'
import { Textarea } from '~/components/ui/textarea'

export const meta: MetaFunction = () => {
  return [
    { title: 'Buildfast' },
    { name: 'description', content: 'Buildfast - Simplify building.' },
  ]
}

export default function Zenx() {
  return (
    <div className="m-24">
      <Textarea placeholder="write.." />
      <Button className="mt-2">Post</Button>
    </div>
  )
}
