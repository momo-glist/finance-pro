// Utilitaires de traduction pour l'affichage en français

export const transactionTypeLabels: Record<string, string> = {
  income: "Revenu",
  expense: "Dépense",
};

export const formatTransactionType = (type: string): string => {
  return transactionTypeLabels[type] || type;
};

export const categoryTypeLabels: Record<string, string> = {
  income: "Revenu",
  expense: "Dépense",
};

export const formatCategoryType = (type: string): string => {
  return categoryTypeLabels[type] || type;
};
