import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Review from '@/lib/models/Review';
import { getMongoDBErrorMessage } from '@/lib/mongodb-helper';

// GET review by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const review = await Review.findById(params.id).populate('productId', 'name price');

    if (!review) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: review }, { status: 200 });
  } catch (error: any) {
    console.error('❌ Error fetching review:', error.message);
    return NextResponse.json(
      {
        success: false,
        error: error.name === 'CastError' ? 'Review not found' : getMongoDBErrorMessage(error),
      },
      { status: error.name === 'CastError' ? 404 : 500 }
    );
  }
}

// PUT update review
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await request.json();

    const review = await Review.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    }).populate('productId', 'name price');

    if (!review) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: review }, { status: 200 });
  } catch (error: any) {
    console.error('❌ Error updating review:', error.message);
    return NextResponse.json(
      {
        success: false,
        error: error.name === 'CastError' ? 'Review not found' : getMongoDBErrorMessage(error),
      },
      { status: error.name === 'CastError' ? 404 : 500 }
    );
  }
}

// DELETE review
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const review = await Review.findByIdAndDelete(params.id);

    if (!review) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: review }, { status: 200 });
  } catch (error: any) {
    console.error('❌ Error deleting review:', error.message);
    return NextResponse.json(
      {
        success: false,
        error: error.name === 'CastError' ? 'Review not found' : getMongoDBErrorMessage(error),
      },
      { status: error.name === 'CastError' ? 404 : 500 }
    );
  }
}
