// Catégories maintenant dynamiques depuis la base de données
export type ITransactionType = "income" | "expense";

export type ITransactionItem = {
  id: string;
  user_id: string;
  title: string;
  type: ITransactionType;
  category: string;
  amount: number;
  transaction_date: string;
  created_at: string;
  updated_at: string;
};

export type ITransactionsResponse = { transaction: ITransactionItem };

export type ITransactionInpute = {
  title: string;
  type: ITransactionType;
  category: string;
  amount: number;
  transactionDate: string;
};

export type ITransactionStore = {
  userTransactions: ITransactionItem[];
  fetchTransactions: (userId: string) => Promise<void>;
  addTransaction: (input: ITransactionInpute) => Promise<void>;
  updateTransaction: (id: string, input: ITransactionInpute) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
};

export type ICategoryItem = {
  id: string;
  user_id: string;
  name: string;
  type: ITransactionType;
  icon: string;
  created_date: string;
  updated_date: string;
};

export type ICategoryInpute = {
  name: string;
  type: ITransactionType;
  icon: string;
};

export type ICategoryStore = {
  userCategories: ICategoryItem[];
  fetchCategories: (userId: string) => Promise<void>;
  addCategory: (input: ICategoryInpute) => Promise<void>;
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
