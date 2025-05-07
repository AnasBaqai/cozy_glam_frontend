import { MockProduct } from "../types/category.types";

// Generate a random price between min and max
const randomPrice = (min: number, max: number): number => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
};

// Generate a random number of products
const generateRandomProducts = (
  count: number,
  categoryId: string,
  categoryName: string,
  subcategoryId: string,
  subcategoryName: string
): MockProduct[] => {
  const products: MockProduct[] = [];
  const productTypes = [
    "Classic",
    "Premium",
    "Deluxe",
    "Signature",
    "Luxury",
    "Essential",
    "Modern",
    "Vintage",
    "Elite",
    "Standard",
  ];

  const descriptions = [
    "High-quality product with premium materials.",
    "Perfect for everyday use with elegant design.",
    "Handcrafted with attention to detail.",
    "Exclusive limited edition with unique features.",
    "Sustainable and eco-friendly choice.",
    "Combines style and functionality.",
    "Designed for comfort and durability.",
    "Elegant solution for modern lifestyle.",
    "Versatile and practical for various occasions.",
    "Made with premium materials for long-lasting use.",
  ];

  const imageCategories = [
    "fashion",
    "product",
    "clothing",
    "accessories",
    "lifestyle",
    "design",
  ];

  for (let i = 0; i < count; i++) {
    const productType =
      productTypes[Math.floor(Math.random() * productTypes.length)];
    const description =
      descriptions[Math.floor(Math.random() * descriptions.length)];
    const imageCategory =
      imageCategories[Math.floor(Math.random() * imageCategories.length)];

    // Generate random image dimensions
    const width = 400 + Math.floor(Math.random() * 200);
    const height = 400 + Math.floor(Math.random() * 200);

    products.push({
      id: `${subcategoryId}-product-${i + 1}`,
      title: `${subcategoryName} ${productType}`,
      image: `https://source.unsplash.com/random/${width}x${height}/?${imageCategory},${subcategoryName.toLowerCase()}`,
      price: randomPrice(19.99, 199.99),
      description: `${subcategoryName} ${productType}: ${description}`,
      categoryId,
      categoryName,
      subcategoryId,
      subcategoryName,
    });
  }

  return products;
};

export const getProductsForSubcategory = (
  categoryId: string,
  categoryName: string,
  subcategoryId: string,
  subcategoryName: string
): MockProduct[] => {
  // Generate between 6 and 12 products
  const count = 6 + Math.floor(Math.random() * 7);
  return generateRandomProducts(
    count,
    categoryId,
    categoryName,
    subcategoryId,
    subcategoryName
  );
};
