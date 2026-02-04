'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Trash2, Edit3, MessageSquare, Package } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Product } from '@/components/products/ProductList';

export interface Review {
  _id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

interface ReviewListProps {
  productId: string | null;
  product: Product | null;
  onEditReview?: (review: Review) => void;
}

export default function ReviewList({ productId, product, onEditReview }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (productId) {
      fetchReviews();
    } else {
      setReviews([]);
      setError(null);
    }
  }, [productId]);

  const fetchReviews = async () => {
    if (!productId) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/reviews?productId=${productId}`);
      const result = await response.json();
      if (result.success) {
        setReviews(result.data);
      } else {
        setError(result.error || 'Failed to fetch reviews');
      }
    } catch (error: any) {
      console.error('Error fetching reviews:', error);
      setError(error.message || 'Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setReviews(reviews.filter((r) => r._id !== reviewId));
      }
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {product && (
          <Card>
            <CardContent className="pt-6">
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        )}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-1/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!productId) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">Select a product</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose a product to view and write reviews
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <p className="text-destructive font-semibold">Error Loading Reviews</p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button onClick={fetchReviews} variant="outline" size="sm">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="space-y-6">
        {product && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                {product.image && (
                  <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden border">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {product.description}
                  </p>
                  <p className="text-xl font-bold mt-2">
                    €{product.price.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        <div className="text-center py-12">
          <Star className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No reviews yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Be the first to review this product!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {product && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              {product.image && (
                <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden border">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {product.description}
                </p>
                <p className="text-xl font-bold mt-2">
                  €{product.price.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Reviews ({reviews.length})</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-bold">{calculateAverageRating()}</span>
            <div className="flex">{renderStars(Math.round(parseFloat(calculateAverageRating())))}</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review._id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {review.userName}
                    <div className="flex ml-2">{renderStars(review.rating)}</div>
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  {onEditReview && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditReview(review)}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteReview(review._id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{review.comment}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
