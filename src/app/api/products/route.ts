import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import { getMongoDBErrorMessage } from '@/lib/mongodb-helper';

// GET all products
export async function GET() {
  try {
    await connectDB();
    const products = await Product.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: products }, { status: 200 });
  } catch (error: any) {
    console.error('❌ Error fetching products:', error.message);
    return NextResponse.json(
      {
        success: false,
        error: getMongoDBErrorMessage(error),
      },
      { status: 500 }
    );
  }
}

// POST create a new product
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const product = await Product.create(body);
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error: any) {
    console.error('❌ Error creating product:', error.message);
    return NextResponse.json(
      {
        success: false,
        error: getMongoDBErrorMessage(error),
      },
      { status: 500 }
    );
  }
}
