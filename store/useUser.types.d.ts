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

  fetchUser: (userId: string) => Promise<boolean>;

  addUser: (data: Partial<IUserItem>) => Promise<boolean>;
};
