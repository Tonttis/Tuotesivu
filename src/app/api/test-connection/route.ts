import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      return NextResponse.json(
        {
          success: false,
          error: 'MONGODB_URI environment variable is not defined',
          envLoaded: false,
          suggestion: 'Please ensure .env file exists and contains MONGODB_URI'
        },
        { status: 500 }
      );
    }

    // Mask the password for security
    const maskedUri = MONGODB_URI.replace(/:([^:@]+)@/, ':****@');

    console.log('🔍 Testing MongoDB connection...');
    console.log('Connection string:', maskedUri);

    // Test connection with timeout
    const options = {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    };

    await mongoose.connect(MONGODB_URI, options);

    await mongoose.connection.close();

    return NextResponse.json(
      {
        success: true,
        message: 'MongoDB connection successful!',
        envLoaded: true,
        connection: {
          maskedUri,
          status: 'connected',
        }
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ MongoDB connection test failed:', error.message);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
        errorName: error.name,
        envLoaded: true,
        suggestion: error.name === 'MongooseServerSelectionError'
          ? 'MongoDB Atlas IP whitelist issue. Please add your IP to MongoDB Atlas Network Access.'
          : 'Please check your MongoDB connection string in .env file.'
      },
      { status: 500 }
    );
  }
}
