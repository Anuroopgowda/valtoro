export function discountPercent(product) {
  const price = Number(product.price);
  const original = Number(product.originalPrice);
  if (!original || original <= price) return 0;
  return Math.round((1 - price / original) * 100);
}
