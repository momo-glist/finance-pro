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
  SHOPPING: "Shopping",
  HEALTH: "Santé",
  EDUCATION: "Éducation",
  SALARY: "Salaire",
  INVESTMENT: "Investissement",
  GIFTS: "Cadeaux",
  TRAVEL: "Voyage",
  UTILITIES: "Services",
  INSURANCE: "Assurance",
  SUBSCRIPTIONS: "Abonnements",
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
  [CATEGORY_KEY.SHOPPING]:
    "https://cdn-icons-png.flaticon.com/128/3081/3081559.png",
  [CATEGORY_KEY.HEALTH]:
    "https://cdn-icons-png.flaticon.com/128/2991/2991148.png",
  [CATEGORY_KEY.EDUCATION]:
    "https://cdn-icons-png.flaticon.com/128/2991/2991106.png",
  [CATEGORY_KEY.SALARY]:
    "https://cdn-icons-png.flaticon.com/128/781/781835.png",
  [CATEGORY_KEY.INVESTMENT]:
    "https://cdn-icons-png.flaticon.com/128/918/918821.png",
  [CATEGORY_KEY.GIFTS]:
    "https://cdn-icons-png.flaticon.com/128/2991/2991151.png",
  [CATEGORY_KEY.TRAVEL]:
    "https://cdn-icons-png.flaticon.com/128/2991/2991150.png",
  [CATEGORY_KEY.UTILITIES]:
    "https://cdn-icons-png.flaticon.com/128/2991/2991152.png",
  [CATEGORY_KEY.INSURANCE]:
    "https://cdn-icons-png.flaticon.com/128/2991/2991153.png",
  [CATEGORY_KEY.SUBSCRIPTIONS]:
    "https://cdn-icons-png.flaticon.com/128/2991/2991154.png",
};

const getFullDate = (expense: any) => {
  const dateStr = expense.transactionDate || expense.transaction_date;
  // Format YYYY-MM-DD to DD/MM/YYYY
  if (dateStr && dateStr.includes("-")) {
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
  }
  // Fallback to Date parsing
  const date = new Date(dateStr);

  if (isNaN(date.getTime())) {
    return "Date invalide";
  }

  const formated = `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getFullYear())}`;

  return formated;
};

export { CATEGORY_KEY, getFullDate, MAP_CATEGORY_TO_ICON, OAUTH };
