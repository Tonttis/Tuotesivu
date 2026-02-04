import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Review from '@/lib/models/Review';
import { getMongoDBErrorMessage } from '@/lib/mongodb-helper';

// GET all reviews (optionally filtered by productId)
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    const filter = productId ? { productId } : {};
    const reviews = await Review.find(filter)
      .sort({ createdAt: -1 })
      .populate('productId', 'name price');

    return NextResponse.json({ success: true, data: reviews }, { status: 200 });
  } catch (error: any) {
    console.error('❌ Error fetching reviews:', error.message);
    return NextResponse.json(
      {
        success: false,
        error: getMongoDBErrorMessage(error),
      },
      { status: 500 }
    );
  }
}

// POST create a new review
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const review = await Review.create(body);
    await review.populate('productId', 'name price');

    return NextResponse.json({ success: true, data: review }, { status: 201 });
  } catch (error: any) {
    console.error('❌ Error creating review:', error.message);
    return NextResponse.json(
      {
        success: false,
        error: getMongoDBErrorMessage(error),
      },
      { status: 500 }
    );
  }
}
