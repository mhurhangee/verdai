import { SignInButton } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'

import Link from 'next/link'

import { Button } from '@/components/ui/button'

import { Github, Trees } from 'lucide-react'

export async function Landing() {
  const { userId } = await auth()

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="flex flex-col items-center gap-6">
          <div className="mb-2 flex items-center gap-3">
            <Trees className="size-16 text-green-600" />
            <span className="bg-gradient-to-br from-green-500 to-green-700 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
              Verdai
            </span>
          </div>
          <div className="text-muted-foreground mb-4 font-mono text-xl font-medium">
            Grow with AI
          </div>
          <div>
            {userId ? (
              <Button size="lg" asChild>
                <Link href="/hub">Go to Hub</Link>
              </Button>
            ) : (
              <SignInButton mode="modal">
                <Button size="lg" className="mr-2">
                  Sign in
                </Button>
              </SignInButton>
            )}
          </div>
        </div>
      </main>
      <footer className="py-6">
        <div className="text-muted-foreground container mx-auto px-4 text-center text-sm">
          <p>
            Built by <a href="mailto:m.hurhangee@me.com">m.hurhangee@me.com</a>{' '}
            <Link href="https://github.com/mhurhangee/verda" target="_blank">
              {' '}
              | <Github className="inline-block size-4" />{' '}
            </Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
