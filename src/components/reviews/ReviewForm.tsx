'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Star, Send } from 'lucide-react';

export interface Review {
  _id?: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
}

interface ReviewFormProps {
  productId: string | null;
  editingReview?: Review | null;
  onSubmit: () => void;
  onCancel?: () => void;
}

export default function ReviewForm({ productId, editingReview, onSubmit, onCancel }: ReviewFormProps) {
  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingReview) {
      setUserName(editingReview.userName);
      setRating(editingReview.rating);
      setComment(editingReview.comment);
    } else {
      setUserName('');
      setRating(5);
      setComment('');
    }
  }, [editingReview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productId) {
      alert('Please select a product first');
      return;
    }

    if (!userName.trim() || !comment.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);

    const reviewData = {
      productId,
      userName: userName.trim(),
      rating,
      comment: comment.trim(),
    };

    try {
      const url = editingReview
        ? `/api/reviews/${editingReview._id}`
        : '/api/reviews';

      const method = editingReview ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setUserName('');
        setRating(5);
        setComment('');
        onSubmit();
      } else {
        const errorMsg = result.details
          ? `${result.error}\n\nDetails: ${result.details}`
          : result.error || 'Failed to save review';
        alert(errorMsg);
      }
    } catch (error) {
      console.error('Error saving review:', error);
      alert('Failed to save review. Please check your console for details.');
    } finally {
      setLoading(false);
    }
  };

  if (!productId) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Select a product to write a review
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingReview ? 'Edit Review' : 'Write a Review'}</CardTitle>
        <CardDescription>
          Share your experience with this product
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userName">Your Name</Label>
            <Input
              id="userName"
              placeholder="Enter your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  disabled={loading}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Your Review</Label>
            <Textarea
              id="comment"
              placeholder="Share your thoughts about this product..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              disabled={loading}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                'Saving...'
              ) : (
                <>
                  {editingReview ? 'Update' : 'Submit'} Review
                  <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
            {onCancel && editingReview && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
