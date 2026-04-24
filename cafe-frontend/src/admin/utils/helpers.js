const today = new Date();

export const daysUntil = (date) => Math.ceil((new Date(date) - today) / 86400000);

export const expiryStatus = (date) => {
  const days = daysUntil(date);
  if (days < 0) return "expired";
  if (days <= 7) return "critical";
  if (days <= 30) return "warning";
  return "good";
};

export const fmt = (value) => `Rs ${Number(value || 0).toLocaleString("en-IN")}`;
