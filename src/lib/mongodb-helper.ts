/**
 * MongoDB Connection Helper
 * Validates MongoDB connection string and provides helpful error messages
 */

export function validateMongoURI(uri: string | undefined): { valid: boolean; error?: string } {
  if (!uri) {
    return { valid: false, error: 'MONGODB_URI is not defined in .env file' };
  }

  if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    return { valid: false, error: 'MongoDB URI must start with mongodb:// or mongodb+srv://' };
  }

  if (!uri.includes('@')) {
    return { valid: false, error: 'MongoDB URI must include authentication credentials' };
  }

  return { valid: true };
}

export function getMongoDBErrorMessage(error: any): string {
  if (!error) return 'Unknown database error';

  const errorMessage = error.message || error.toString();

  if (errorMessage.includes('IP whitelist') || errorMessage.includes('server selection')) {
    return 'MongoDB connection failed. Please whitelist your IP in MongoDB Atlas: https://www.mongodb.com/docs/atlas/security-whitelist/';
  }

  if (errorMessage.includes('Authentication failed') || errorMessage.includes('auth')) {
    return 'MongoDB authentication failed. Please check your username and password.';
  }

  if (errorMessage.includes('ENOTFOUND') || errorMessage.includes('getaddrinfo')) {
    return 'MongoDB host not found. Please check your connection string.';
  }

  if (errorMessage.includes('connection timeout')) {
    return 'MongoDB connection timed out. Please check your network connection.';
  }

  return `MongoDB error: ${errorMessage}`;
}
