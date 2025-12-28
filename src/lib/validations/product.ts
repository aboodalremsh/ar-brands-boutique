import { z } from 'zod';

// Validation schema for product data
export const productSchema = z.object({
  name: z.string()
    .min(1, 'Product name is required')
    .max(200, 'Product name must be less than 200 characters')
    .trim(),
  description: z.string()
    .max(2000, 'Description must be less than 2000 characters')
    .nullable()
    .optional(),
  price: z.number()
    .positive('Price must be a positive number')
    .max(999999.99, 'Price must be less than $1,000,000'),
  category_id: z.string().uuid().nullable().optional(),
  images: z.array(
    z.string()
      .url('Each image must be a valid URL')
      .max(500, 'Image URL must be less than 500 characters')
  ).max(10, 'Maximum 10 images allowed').optional().default([]),
  sizes: z.array(
    z.string()
      .max(20, 'Size must be less than 20 characters')
      .trim()
  ).max(20, 'Maximum 20 sizes allowed').optional().default([]),
  colors: z.array(
    z.string()
      .max(30, 'Color must be less than 30 characters')
      .trim()
  ).max(20, 'Maximum 20 colors allowed').optional().default([]),
  is_available: z.boolean().default(true),
  is_featured: z.boolean().default(false),
});

export type ProductFormData = z.infer<typeof productSchema>;

// Type for validated product ready for database
export interface ValidatedProduct {
  name: string;
  description: string | null;
  price: number;
  category_id: string | null;
  images: string[];
  sizes: string[];
  colors: string[];
  is_available: boolean;
  is_featured: boolean;
}

// Helper function to validate product data
export function validateProductData(data: unknown): { success: true; data: ValidatedProduct } | { success: false; errors: string[] } {
  const result = productSchema.safeParse(data);
  
  if (result.success) {
    // Ensure all required fields are present with proper types
    const validated: ValidatedProduct = {
      name: result.data.name,
      description: result.data.description ?? null,
      price: result.data.price,
      category_id: result.data.category_id ?? null,
      images: result.data.images ?? [],
      sizes: result.data.sizes ?? [],
      colors: result.data.colors ?? [],
      is_available: result.data.is_available ?? true,
      is_featured: result.data.is_featured ?? false,
    };
    return { success: true, data: validated };
  }
  
  const errors = result.error.errors.map(err => {
    const path = err.path.join('.');
    return path ? `${path}: ${err.message}` : err.message;
  });
  
  return { success: false, errors };
}
