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
import Link from "next/link"

export default function LoginForm() {
  return (
    <div className="grid gap-6">
        <div className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="username">User Name</Label>
                <Input
                    id="username"
                    type="text"
                    placeholder="your-username"
                    required
                />
            </div>
            <div className="grid gap-2">
                <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                    href="#"
                    className="ml-auto inline-block text-sm underline"
                    >
                    Forgot your password?
                    </Link>
                </div>
                <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
            Login
            </Button>
        </div>
    </div>
  )
}
