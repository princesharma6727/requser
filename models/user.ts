import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"

export interface User {
  _id?: ObjectId | string
  id?: number
  email: string
  first_name: string
  last_name: string
  avatar: string
  password?: string
}

function isValidObjectId(id: string) {
  return /^[a-f\d]{24}$/i.test(id)
}

export async function getUsers(page = 1, perPage = 6) {
  const client = await clientPromise
  const db = client.db()

  const skip = (page - 1) * perPage

  const users = await db.collection("users").find({}).skip(skip).limit(perPage).toArray()
  const total = await db.collection("users").countDocuments()

  return {
    data: users.map((user) => ({
      id: user.id || user._id?.toString(),
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      avatar: user.avatar || `https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=random`,
    })),
    page,
    per_page: perPage,
    total,
    total_pages: Math.ceil(total / perPage),
  }
}

export async function getUserById(id: string) {
  const client = await clientPromise
  const db = client.db()

  const query = {
    $or: [
      ...(isValidObjectId(id) ? [{ _id: new ObjectId(id) }] : []),
      { id: Number.parseInt(id) },
    ],
  }

  const user = await db.collection("users").findOne(query)

  if (!user) return null

  return {
    id: user.id || user._id?.toString(),
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    avatar: user.avatar || `https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=random`,
  }
}

export async function updateUser(id: string, userData: Partial<User>) {
  const client = await clientPromise
  const db = client.db()

  const query = {
    $or: [
      ...(isValidObjectId(id) ? [{ _id: new ObjectId(id) }] : []),
      { id: Number.parseInt(id) },
    ],
  }

  const result = await db.collection("users").updateOne(query, {
    $set: userData,
  })

  if (result.matchedCount === 0) return null

  return await getUserById(id)
}

export async function deleteUser(id: string) {
  const client = await clientPromise
  const db = client.db()

  const query = {
    $or: [
      ...(isValidObjectId(id) ? [{ _id: new ObjectId(id) }] : []),
      { id: Number.parseInt(id) },
    ],
  }

  const result = await db.collection("users").deleteOne(query)

  return result.deletedCount > 0
}

export async function seedInitialUsers() {
  const client = await clientPromise
  const db = client.db()

  const count = await db.collection("users").countDocuments()

  if (count === 0) {
    const response = await fetch("https://reqres.in/api/users?per_page=12")
    const data = await response.json()

    if (data.data && data.data.length > 0) {
      await db.collection("users").insertMany(data.data)
      console.log("Initial users seeded from Reqres API")
    }
  }
}
