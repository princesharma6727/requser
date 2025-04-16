import { redirect } from "next/navigation"
import LoginForm from "@/components/login-form"

export default function Home() {
  // If we're on the client and have a token, redirect to users page
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token")
    if (token) {
      redirect("/users")
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">User Management System</h1>
          <p className="text-gray-500 mt-2">Please login to continue</p>
        </div>
        <LoginForm />
      </div>
    </main>
  )
}
