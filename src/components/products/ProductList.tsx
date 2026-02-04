'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Package } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

interface ProductListProps {
  onSelectProduct: (product: Product) => void;
  selectedProductId?: string;
}

export default function ProductList({ onSelectProduct, selectedProductId }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/products');
      const result = await response.json();

      if (result.success) {
        setProducts(result.data);
      } else {
        setError(result.error || 'Failed to fetch products');
      }
    } catch (error: any) {
      console.error('Error fetching products:', error);
      setError(error.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <p className="text-destructive font-semibold">Error Loading Products</p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button onClick={fetchProducts} variant="outline" size="sm">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No products yet</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Be the first to add a product!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card
          key={product._id}
          className={`cursor-pointer transition-all hover:shadow-lg overflow-hidden ${
            selectedProductId === product._id ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => onSelectProduct(product)}
        >
          {product.image && (
            <div className="w-full h-48 overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <CardHeader className={product.image ? 'pb-4' : ''}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-xl line-clamp-1">{product.name}</CardTitle>
                <Badge variant="secondary" className="mt-2">
                  {product.category}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="line-clamp-2 min-h-[40px]">
              {product.description}
            </CardDescription>
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <div className="text-2xl font-bold">
              €{product.price.toFixed(2)}
            </div>
            <Button variant="outline" size="sm">
              View Reviews
              <Star className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
