import { type NextRequest, NextResponse } from "next/server"
import { sign } from "jsonwebtoken"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // For demo purposes, we'll use the same credentials as Reqres
    if (email === "eve.holt@reqres.in" && password === "cityslicka") {
      // Generate JWT token
      const token = sign({ email }, process.env.JWT_SECRET || "fallback_secret", { expiresIn: "7d" })

      return NextResponse.json({ token })
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
