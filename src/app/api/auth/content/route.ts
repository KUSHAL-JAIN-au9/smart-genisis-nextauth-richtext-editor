import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Content from '@/models/content';
import { getSession } from 'next-auth/react';
import User from '@/models/user';

// POST: Create new content
export async function POST(request: Request) {
  await connectToDatabase();
  const session = await getSession({
    req: { headers: Object.fromEntries(request.headers) },
  });

  if (!session) {
    return NextResponse.json(
      { message: 'You must be logged in to create content' },
      { status: 401 }
    );
  }
  const { content } = await request.json();
  if (!content) {
    return NextResponse.json(
      { message: 'Content is required' },
      { status: 400 }
    );
  }

  // Fetch the user ID using the email from the session
  const userData = await User.findOne({ email: session?.user?.email });
  console.log('content email', content, session, userData);

  const newContent = new Content({ content, user: userData?._id });
  await newContent.save();
  // Push the new content ID into the user's contents array
  if (userData) {
    userData.contents.push(newContent?.id);
    await userData.save();
  }

  // Populate the user object in the new content
  await newContent.populate('user');

  return NextResponse.json(
    { message: 'Note added sucessfully', data: newContent },
    { status: 201 }
  );
}

// GET: Retrieve existing content
export async function GET(request: Request) {
  await connectToDatabase();
  const session = await getSession({
    req: { headers: Object.fromEntries(request?.headers) },
  });

  if (!session) {
    return NextResponse.json(
      { message: 'You must be logged in to view content' },
      { status: 401 }
    );
  }

  // Fetch the user ID using the email from the session
  const user = await User.findOne({ email: session?.user?.email })
    .populate('contents')
    .exec();
  console.log('Fetching user data', user, !user, session);
  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  const contents = await Content.find({ user: user._id })
    .populate('user')
    .exec();

  return NextResponse.json(
    { message: 'notes fetched sucessfully', data: contents },
    { status: 200 }
  );
}

// PUT: Update existing content
export async function PUT(request: Request) {
  await connectToDatabase();
  const { id, content } = await request.json();

  if (!id || !content) {
    return NextResponse.json(
      { message: 'ID and content are required' },
      { status: 400 }
    );
  }

  const updatedContent = await Content.findByIdAndUpdate(
    id,
    { content },
    { new: true }
  );

  if (!updatedContent) {
    return NextResponse.json({ message: 'Content not found' }, { status: 404 });
  }

  return NextResponse.json(updatedContent, { status: 200 });
}
