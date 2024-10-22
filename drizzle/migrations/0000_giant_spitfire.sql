CREATE TABLE `expenseCategory` (
	`category_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`category_name` text(255) NOT NULL,
	`user_defined` integer DEFAULT 0,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `expense` (
	`expense_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`category_id` integer,
	`expense_amount` real NOT NULL,
	`note` text(255),
	`expense_date` text DEFAULT CURRENT_DATE NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`category_id`) REFERENCES `expenseCategory`(`category_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `income` (
	`income_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`note` text(255),
	`income_amount` real NOT NULL,
	`income_date` text DEFAULT CURRENT_DATE NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`user_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text(255) NOT NULL,
	`password` text(255) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);