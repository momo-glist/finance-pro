const OAUTH = {
  GOOGLE_OAUTH: "oauth_google",
  GITHUB_OAUTH: "oauth_github",
  APPLE_OAUTH: "oauth_apple",
};

const CATEGORY_KEY = {
  FOOD: "Nourriture",
  TRANSPORT: "Transport",
  GROCERIES: "Épicerie",
  ENTERTAINMENT: "Divertissements",
  BILLS: "Factures",
};

const MAP_CATEGORY_TO_ICON = {
  [CATEGORY_KEY.FOOD]:
    "https://cdn-icons-png.flaticon.com/128/5359/5359085.png",
  [CATEGORY_KEY.TRANSPORT]:
    "https://cdn-icons-png.flaticon.com/128/2357/2357242.png",
  [CATEGORY_KEY.GROCERIES]:
    "https://cdn-icons-png.flaticon.com/128/4168/4168659.png",
  [CATEGORY_KEY.ENTERTAINMENT]:
    "https://cdn-icons-png.flaticon.com/128/4423/4423702.png",
  [CATEGORY_KEY.BILLS]:
    "https://cdn-icons-png.flaticon.com/128/9382/9382189.png",
};

const getFullDate = (expense: any) => {
  const dateStr = expense.expenseDate || expense.expense_date;
  const date = new Date(dateStr);

  if (isNaN(date.getTime())) {
    return "Date invalide";
  }

  const formated = `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getFullYear())}`;

  return formated;
};

export { CATEGORY_KEY, getFullDate, MAP_CATEGORY_TO_ICON, OAUTH };
