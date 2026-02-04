import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import { getMongoDBErrorMessage } from '@/lib/mongodb-helper';

// GET product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const product = await Product.findById(params.id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product }, { status: 200 });
  } catch (error: any) {
    console.error('❌ Error fetching product:', error.message);
    return NextResponse.json(
      {
        success: false,
        error: error.name === 'CastError' ? 'Product not found' : getMongoDBErrorMessage(error),
      },
      { status: error.name === 'CastError' ? 404 : 500 }
    );
  }
}

// DELETE product by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const product = await Product.findByIdAndDelete(params.id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product }, { status: 200 });
  } catch (error: any) {
    console.error('❌ Error deleting product:', error.message);
    return NextResponse.json(
      {
        success: false,
        error: error.name === 'CastError' ? 'Product not found' : getMongoDBErrorMessage(error),
      },
      { status: error.name === 'CastError' ? 404 : 500 }
    );
  }
}
