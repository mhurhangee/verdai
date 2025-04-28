import { auth } from '@clerk/nextjs/server'

import { redirect } from 'next/navigation'

import { OrganizationList } from '@/components/clerk-org-list'

export default async function OrgsPage() {
  const { orgId } = await auth()

  // If user has an active organization, redirect to the dashboard
  if (orgId) {
    redirect(`/hub`)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        <div className="flex w-full max-w-md flex-col items-center gap-6">
          <div>
            <h1 className="mb-2 text-3xl font-extrabold">Your organization</h1>
            <p className="text-muted-foreground mb-6 text-base">
              Select or create an organization to get started
            </p>
          </div>
          <OrganizationList />
        </div>
      </main>
    </div>
  )
}
