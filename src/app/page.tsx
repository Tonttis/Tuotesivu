'use client';

import { useState } from 'react';
import ProductList, { Product } from '@/components/products/ProductList';
import ProductForm from '@/components/products/ProductForm';
import ReviewList, { Review } from '@/components/reviews/ReviewList';
import ReviewForm from '@/components/reviews/ReviewForm';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, Star, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setEditingReview(null);
  };

  const handleProductSubmitted = () => {
    setRefreshKey((prev) => prev + 1);
    toast.success('Product added successfully!');
  };

  const handleReviewSubmitted = () => {
    setEditingReview(null);
    setRefreshKey((prev) => prev + 1);
    toast.success('Review submitted successfully!');
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex flex-col">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <PlusCircle className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Product Review Hub</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Products */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Products
                </h2>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="list" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="list">Products</TabsTrigger>
                    <TabsTrigger value="form">Add</TabsTrigger>
                  </TabsList>

                  <TabsContent value="list" className="mt-6">
                    <ProductList
                      key={`products-${refreshKey}`}
                      onSelectProduct={handleSelectProduct}
                      selectedProductId={selectedProduct?._id}
                    />
                  </TabsContent>

                  <TabsContent value="form" className="mt-6">
                    <ProductForm onSubmit={handleProductSubmitted} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Reviews */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  {selectedProduct ? `Reviews for ${selectedProduct.name}` : 'Reviews'}
                </h2>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="list" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="list">Reviews</TabsTrigger>
                    <TabsTrigger value="form">
                      {editingReview ? 'Edit' : 'Write'}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="list" className="mt-6">
                    <ReviewList
                      key={`reviews-${refreshKey}`}
                      productId={selectedProduct?._id || null}
                      product={selectedProduct}
                      onEditReview={handleEditReview}
                    />
                  </TabsContent>

                  <TabsContent value="form" className="mt-6">
                    <ReviewForm
                      productId={selectedProduct?._id || null}
                      editingReview={editingReview}
                      onSubmit={handleReviewSubmitted}
                      onCancel={handleCancelEdit}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="border-t bg-background/95 backdrop-blur mt-auto">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            Product Review Page - Tino Kortelainen
          </p>
        </div>
      </footer>
    </div>
  );
}
