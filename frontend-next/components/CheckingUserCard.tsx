import React from 'react'
import { Card, CardContent } from './ui/card'
import { Loader2 } from 'lucide-react'

const CheckingUserCard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
        <Card className="bg-card border-border text-primary-foreground">
        <CardContent className="flex items-center justify-center space-x-4 p-6">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-lg font-medium">Checking for User...</p>
        </CardContent>
        </Card>
    </div>
  )
}

export default CheckingUserCard