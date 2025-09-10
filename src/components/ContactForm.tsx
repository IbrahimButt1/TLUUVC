"use client"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { Input } from "@/components/ui/input"
  import { Label } from "@/components/ui/label"
  import { Button } from "@/components/ui/button"
  import { Plane } from "lucide-react"
  import Link from "next/link"
  
  export default function LoginForm() {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md p-6">
          <CardHeader className="px-0 pt-0">
            <div className="flex items-center gap-2 mb-4">
              <Plane className="h-6 w-6 text-primary" />
              <span className="font-semibold">Microsoft</span>
            </div>
            <CardTitle className="text-3xl">Sign in</CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="Email, phone, or Skype"
                  required
                />
              </div>
                <div className="text-sm">
                    No account? <Link href="#" className="text-primary hover:underline">Create one!</Link>
                </div>
                 <div className="text-sm">
                    <Link href="#" className="text-primary hover:underline">Can't access your account?</Link>
                </div>
            </div>
          </CardContent>
          <CardFooter className="justify-end px-0 pb-0 pt-8 gap-2">
            <Button variant="outline">Back</Button>
            <Button>Next</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }
