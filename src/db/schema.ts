import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, real, uniqueIndex } from 'drizzle-orm/sqlite-core';

// users table
export const users = sqliteTable('users', {
  user_id: integer('user_id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  username: text('username', { length: 255 }).notNull().unique(),
  password: text('password', { length: 255 }).notNull(),
});

// incomes table
export const incomes = sqliteTable('income', {
  income_id: integer('income_id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  user_id: integer('user_id').references(() => users.user_id),
  note: text('note', { length: 255 }),
  income_amount: real('income_amount').notNull(),
  income_date: text('income_date').default(sql`CURRENT_DATE`).notNull(),
});

// expenseCategories table
export const expenseCategories = sqliteTable('expenseCategory', {
  category_id: integer('category_id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  user_id: integer('user_id').references(() => users.user_id),
  category_name: text('category_name', { length: 255 }).notNull(),
  user_defined: integer('user_defined').default(0), // 0 = false, 1 = true for boolean
});

// Lisää uniqueIndex rajoitteen taululle
export const expenseCategoryUniqueIndex = uniqueIndex('expenseCategory_unique')
  .on(expenseCategories.user_id, expenseCategories.category_name);

// userExpenses table
export const expenses = sqliteTable('expense', {
  expense_id: integer('expense_id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  user_id: integer('user_id').references(() => users.user_id),
  category_id: integer('category_id').references(() => expenseCategories.category_id),
  expense_amount: real('expense_amount').notNull(),
  note: text('note', { length: 255 }),
  expense_date: text('expense_date').default(sql`CURRENT_DATE`).notNull(),
});