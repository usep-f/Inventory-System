CREATE TABLE `settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`pin` text DEFAULT '1234' NOT NULL,
	`port` integer DEFAULT 3000 NOT NULL
);
