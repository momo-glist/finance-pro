export type IExpenseCategory =
  | "Nourriture"
  | "Transport"
  | "Épicerie"
  | "Divertissements"
  | "Factures";

export type IExpenseItem = {
  id: string;
  title: string;
  category: IExpenseCategory;
  amount: number;
  expense_date: string;
};

export type IExpensesResponse = { expense: IExpenseItem };

export type IExpenseInpute = {
  title: string;
  category: IExpenseCategory;
  amount: number;
  expenseDate: string;
};

export type IExpenseStore = {
  userExpenses: IExpenseItem[];
  fetchExpenses: () => Promise<void>;
  addExpense: (input: IExpenseInpute) => Promise<void>;
  updateExpense: (id: string, input: IExpenseInpute) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
};

export type MonthData = {
  label: string;
  value: number;
  monthIndex: number;
};

export type IGenericStringMap = {
  [key: string]: string;
};

type IToCamelCase = (ket: string) => string;
