import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Content from "@/models/content";

// POST: Create new content
export async function POST(request: Request) {
  await connectToDatabase();
  const { content } = await request.json();
  console.log("content", content);
  if (!content) {
    return NextResponse.json(
      { message: "Content is required" },
      { status: 400 }
    );
  }

  const newContent = new Content({ content });
  await newContent.save();

  return NextResponse.json(
    { message: "Note added sucessfully", data: newContent },
    { status: 201 }
  );
}

// GET: Retrieve existing content
export async function GET() {
  await connectToDatabase();
  const content = await Content.find();

  console.log("content", content);

  if (!content) {
    return NextResponse.json(
      { message: "No content found", data: [] },
      { status: 404 }
    );
  }

  return NextResponse.json(
    { message: "notes fetched sucessfully", data: content },
    { status: 200 }
  );
}

// PUT: Update existing content
export async function PUT(request: Request) {
  await connectToDatabase();
  const { id, content } = await request.json();

  if (!id || !content) {
    return NextResponse.json(
      { message: "ID and content are required" },
      { status: 400 }
    );
  }

  const updatedContent = await Content.findByIdAndUpdate(
    id,
    { content },
    { new: true }
  );

  if (!updatedContent) {
    return NextResponse.json({ message: "Content not found" }, { status: 404 });
  }

  return NextResponse.json(updatedContent, { status: 200 });
}
