export const formatKES = (value) =>
  `KES ${new Intl.NumberFormat("en-KE", {
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0)}`;

export const getStockStatus = (stock) => {
  if (stock <= 0) return "Out of Stock";
  if (stock <= 5) return "Low Stock";
  return "In Stock";
};

export const formatDate = (value) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-KE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};