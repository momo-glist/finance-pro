import {
  IExpenseItem,
  IGenericStringMap,
  IToCamelCase,
  MonthData,
} from "@/store/useExpensesStore.types";

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

const getTotalExpense = (expenses: IExpenseItem[]): number => {
  if (!expenses || expenses.length === 0) {
    return 0;
  }
  return expenses.reduce((total, expense) => total + Number(expense.amount || 0), 0);
};

const getcurrentMonthExpense = (data: IExpenseItem[]): number => {
  if (!data || data.length === 0) {
    return 0;
  }

  let currentMonthExpense = 0;
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  data.forEach((expenses: IExpenseItem) => {
    const dateStr = (expenses as any).expenseDate || expenses.expense_date;
    const date = new Date(dateStr);

    if (
      date.getMonth() === currentMonth &&
      date.getFullYear() === currentYear
    ) {
      currentMonthExpense += Number(expenses.amount || 0);
    }
  });

  return currentMonthExpense;
};

const getMonthWiseChartData = (data: IExpenseItem[]) => {
  if (!data || data.length === 0) {
    return [];
  }

  const monthlyMap: Record<number, MonthData> = {};

  data.forEach((item) => {
    const dateStr = (item as any).expenseDate || item.expense_date;
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

export {
  convertKeysToCamelCase,
  getcurrentMonthExpense,
  getMonthWiseChartData,
  getTotalExpense
};

