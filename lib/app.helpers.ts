import {
  IGenericStringMap,
  IToCamelCase,
  ITransactionItem,
  MonthData,
} from "@/store/useTransactionsStore.types";

const toCamalCase: IToCamelCase = (str) => {
  return str.replace(/([-_][a-z])/gi, (match) =>
    match.toUpperCase().replace("-", "").replace("_", ""),
  );
};

const convertKeysToCamelCase = <T>(obj: T): T => {
  if (Array.isArray(obj)) {
    const mappedArray = obj.map(convertKeysToCamelCase) as unknown as T;

    return mappedArray;
  }

  if (obj !== null && typeof obj === "object") {
    const keys = Object.keys(obj);

    return keys.reduce((result: T, key: string) => {
      const camelKey = toCamalCase(key);

      (result as IGenericStringMap)[camelKey] = convertKeysToCamelCase(
        (obj as IGenericStringMap)[key],
      );

      return result;
    }, {} as T);
  }

  return obj;
};

const getTotalIncome = (transactions: ITransactionItem[]): number => {
  if (!transactions || transactions.length === 0) {
    return 0;
  }
  return transactions
    .filter((t) => t.type === "income")
    .reduce((total, transaction) => total + Number(transaction.amount || 0), 0);
};

const getTotalExpense = (transactions: ITransactionItem[]): number => {
  if (!transactions || transactions.length === 0) {
    return 0;
  }
  return transactions
    .filter((t) => t.type === "expense")
    .reduce((total, transaction) => total + Number(transaction.amount || 0), 0);
};

const getcurrentMonthExpense = (data: ITransactionItem[]): number => {
  if (!data || data.length === 0) {
    return 0;
  }

  let currentMonthExpense = 0;
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  data.forEach((transaction: ITransactionItem) => {
    if (transaction.type !== "expense") return;

    const dateStr =
      (transaction as any).transactionDate || transaction.transaction_date;
    const date = new Date(dateStr);

    if (
      date.getMonth() === currentMonth &&
      date.getFullYear() === currentYear
    ) {
      currentMonthExpense += Number(transaction.amount || 0);
    }
  });

  return currentMonthExpense;
};

const getcurrentMonthIncome = (data: ITransactionItem[]): number => {
  if (!data || data.length === 0) {
    return 0;
  }

  let currentMonthIncome = 0;
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  data.forEach((transaction: ITransactionItem) => {
    if (transaction.type !== "income") return;

    const dateStr =
      (transaction as any).transactionDate || transaction.transaction_date;
    const date = new Date(dateStr);

    if (
      date.getMonth() === currentMonth &&
      date.getFullYear() === currentYear
    ) {
      currentMonthIncome += Number(transaction.amount || 0);
    }
  });

  return currentMonthIncome;
};

const getCurrentMonthBalance = (data: ITransactionItem[]): number => {
  if (!data || data.length === 0) {
    return 0;
  }

  let currentMonthBalance = 0;
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  data.forEach((transaction: ITransactionItem) => {
    const dateStr =
      (transaction as any).transactionDate || transaction.transaction_date;
    const date = new Date(dateStr);

    if (
      date.getMonth() === currentMonth &&
      date.getFullYear() === currentYear
    ) {
      currentMonthBalance += Number(transaction.amount || 0);
    }
  });

  return currentMonthBalance;
};

const getMonthWiseChartData = (data: ITransactionItem[]) => {
  if (!data || data.length === 0) {
    return [];
  }

  const monthlyMap: Record<number, MonthData> = {};

  data.forEach((item) => {
    const dateStr = (item as any).transactionDate || item.transaction_date;
    const date = new Date(dateStr);

    const monthIndex = date.getMonth();
    const monthLabel = date.toLocaleString("fr-FR", {
      month: "short",
    });

    if (!monthlyMap[monthIndex]) {
      monthlyMap[monthIndex] = {
        label: monthLabel,
        value: 0,
        monthIndex,
      };
    }

    monthlyMap[monthIndex].value += Number(item.amount || 0);
  });

  const chartData = Object.values(monthlyMap)
    .sort((a, b) => a.monthIndex - b.monthIndex)
    .map(({ label, value }) => ({
      label,
      value,
    }));

  return chartData;
};

const getIncomeVsExpenseChartData = (data: ITransactionItem[]) => {
  if (!data || data.length === 0) {
    return [];
  }

  const monthlyMap: Record<
    number,
    { income: number; expense: number; label: string; monthIndex: number }
  > = {};

  data.forEach((item) => {
    const dateStr = (item as any).transactionDate || item.transaction_date;
    const date = new Date(dateStr);

    const monthIndex = date.getMonth();
    const monthLabel = date.toLocaleString("fr-FR", {
      month: "short",
    });

    if (!monthlyMap[monthIndex]) {
      monthlyMap[monthIndex] = {
        label: monthLabel,
        income: 0,
        expense: 0,
        monthIndex,
      };
    }

    if (item.type === "income") {
      monthlyMap[monthIndex].income += Number(item.amount || 0);
    } else if (item.type === "expense") {
      monthlyMap[monthIndex].expense += Number(item.amount || 0);
    }
  });

  const chartData = Object.values(monthlyMap)
    .sort((a, b) => a.monthIndex - b.monthIndex)
    .map(({ label, income, expense }) => ({
      label,
      income,
      expense,
    }));

  return chartData;
};

const getTopCategory = (transactions: ITransactionItem[]) => {
  const categoryData = getCategoryWiseData(transactions);
  const topCategory = {
    label: "",
    amount: 0,
    percentage: 0,
  };
  let totalSum = 0;

  categoryData.forEach((category) => {
    totalSum += category.value;
    if (category.value > topCategory.amount) {
      topCategory.amount = category.value;
      topCategory.label = category.label;
    }
  });

  topCategory.percentage =
    totalSum > 0 ? (topCategory.amount / totalSum) * 100 : 0;

  return topCategory;
};

const getCategoryWiseData = (data: ITransactionItem[]) => {
  const categoryData: Record<string, ITransactionItem[]> = {};

  data.forEach((item) => {
    if (!categoryData[item.category_id]) {
      categoryData[item.category_id] = [];
    }

    categoryData[item.category_id].push(item);
  });

  const chartData = Object.entries(categoryData).map(
    ([category_id, transactions]) => {
      const total = transactions.reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0,
      );

      return {
        label: category_id,
        value: total,
      };
    },
  );

  return chartData;
};

export {
  convertKeysToCamelCase,
  getCategoryWiseData,
  getCurrentMonthBalance,
  getcurrentMonthExpense,
  getcurrentMonthIncome,
  getIncomeVsExpenseChartData,
  getMonthWiseChartData,
  getTopCategory,
  getTotalExpense,
  getTotalIncome,
};

