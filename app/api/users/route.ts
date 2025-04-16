import { type NextRequest, NextResponse } from "next/server"
import { getUsers, seedInitialUsers } from "@/models/user"

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get("page") || "1")
    const perPage = Number.parseInt(searchParams.get("per_page") || "6")

    // Ensure we have initial data
    await seedInitialUsers()

    // Get users from MongoDB
    const result = await getUsers(page, perPage)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
