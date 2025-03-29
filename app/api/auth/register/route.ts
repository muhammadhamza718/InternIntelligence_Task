import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "next-sanity"
import bcrypt from "bcryptjs"

// Initialize Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2023-05-03",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const { name, email, password } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Name, email, and password are required" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ message: "Password must be at least 8 characters long" }, { status: 400 })
    }

    // Check if user already exists
    const existingUserQuery = `*[_type == "user" && email == $email][0]`
    const existingUser = await client.fetch(existingUserQuery, { email })

    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 409 })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user in Sanity
    const newUser = {
      _type: "user",
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    }

    const createdUser = await client.create(newUser)

    return NextResponse.json({
      message: "User registered successfully",
      userId: createdUser._id,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "An error occurred during registration" }, { status: 500 })
  }
}

