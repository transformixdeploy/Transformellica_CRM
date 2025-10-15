import Link from 'next/link'
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const DocsPage = () => {
  return (
    <div className='min-h-screen bg-background text-foreground p-6'>
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-4xl font-bold">Docs</CardTitle>
          <CardDescription className="font-medium text-sm">Welcome to our documentation page. Here you can find all useful resources you need.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-sm text-popover-foreground">CSV Template : </h4>
            <Link href={"https://res.cloudinary.com/dj3f7lzmd/raw/upload/v1758477226/crm_template_eshj2w.csv"} className="text-blue-500 hover:underline">Download Template</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DocsPage