import type { MetaFunction } from '@remix-run/node'

import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'
import { Button } from '~/components/ui/button'
import { isLoggedIn } from '~/lib/utils'
import { useNavigate } from '@remix-run/react'

export const meta: MetaFunction = () => {
  return [
    { title: 'Buildfast' },
    { name: 'description', content: 'Buildfast - Simplify building.' },
  ]
}

export default function Signin() {
  const navigate = useNavigate()

  async function signup(token: string) {
    const response = await fetch(`http://localhost:3000/signup`, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: new Headers({
        'content-type': 'application/json',
        authorization: `Bearer ${token}`,
      }),
    })
    const data = await response.json()
    console.log('data', data, data.role)

    location.reload()
  }
  return (
    <GoogleOAuthProvider clientId="1023922499668-kl4m94qd7i18g7isrtn3096n6nlc45q6.apps.googleusercontent.com">
      <div className="m-24 flex">
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            signup(credentialResponse.credential!)
            localStorage.setItem('credential', credentialResponse.credential!)
          }}
          onError={() => {
            console.log('Login Failed')
          }}
        />
        {isLoggedIn() && (
          <Button
            variant={'outline'}
            className="ml-1"
            onClick={() => {
              //@ts-ignore
              google.accounts.id.revoke('butu25@gmail.com', (_done) => {
                localStorage.removeItem('credential')
                navigate('/')
                setTimeout(() => {
                  location.reload()
                }, 500)
              })
            }}
          >
            Sign out
          </Button>
        )}
      </div>
    </GoogleOAuthProvider>
  )
}
