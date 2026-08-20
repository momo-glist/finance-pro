export type IUserItem = {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  currency: string | null;
  created_at: Date | string;
  updated_at: Date | string;
};

export type IUserStore = {
  user: IUserItem | null;
  fetchUser: (clerkUser: any) => Promise<void>;
  addUser: (data: Partial<IUserItem>) => Promise<void>;
};
