
import { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: "1",
    name: "Classic White T-Shirt",
    price: 29.99,
    originalPrice: 39.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop",
    category: "T-Shirts",
    description: "A comfortable and versatile white t-shirt made from 100% organic cotton. Perfect for everyday wear.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Black", "Gray"],
    rating: 4.5,
    reviews: 124,
    inStock: true
  },
  {
    id: "2",
    name: "Denim Jacket",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=500&fit=crop",
    category: "Jackets",
    description: "Classic denim jacket with a modern fit. Made from premium denim with subtle distressing.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Blue", "Black", "Light Blue"],
    rating: 4.8,
    reviews: 89,
    inStock: true
  },
  {
    id: "3",
    name: "Floral Summer Dress",
    price: 69.99,
    originalPrice: 89.99,
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop",
    category: "Dresses",
    description: "Beautiful floral summer dress perfect for warm weather. Features a flattering A-line silhouette.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Floral", "Navy", "Pink"],
    rating: 4.7,
    reviews: 156,
    inStock: true
  },
  {
    id: "4",
    name: "Leather Sneakers",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop",
    category: "Shoes",
    description: "Premium leather sneakers with comfortable cushioning. Perfect for casual and smart-casual occasions.",
    sizes: ["7", "8", "9", "10", "11", "12"],
    colors: ["White", "Black", "Brown"],
    rating: 4.6,
    reviews: 203,
    inStock: true
  },
  {
    id: "5",
    name: "Wool Sweater",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=500&fit=crop",
    category: "Sweaters",
    description: "Cozy wool sweater perfect for cooler weather. Features a classic crew neck design.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Navy", "Gray", "Burgundy"],
    rating: 4.4,
    reviews: 78,
    inStock: true
  },
  {
    id: "6",
    name: "Slim Fit Jeans",
    price: 59.99,
    originalPrice: 79.99,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop",
    category: "Jeans",
    description: "Modern slim fit jeans with stretch fabric for comfort. Classic 5-pocket styling.",
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Dark Blue", "Light Blue", "Black"],
    rating: 4.3,
    reviews: 291,
    inStock: true
  }
];

export const categories = [
  "All",
  "T-Shirts",
  "Jackets",
  "Dresses",
  "Shoes",
  "Sweaters",
  "Jeans"
];
