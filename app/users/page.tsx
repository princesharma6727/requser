"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import UsersList from "@/components/users-list"
import { AuthProvider } from "@/context/auth-context"

export default function UsersPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if token exists, if not redirect to login
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/")
    }
  }, [router])

  return (
    <AuthProvider>
      <main className="min-h-screen p-4 md:p-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">User Management</h1>
          <UsersList />
        </div>
      </main>
    </AuthProvider>
  )
}
