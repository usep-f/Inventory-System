PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`product_id` integer,
	`product_name` text DEFAULT '' NOT NULL,
	`product_barcode` text DEFAULT '' NOT NULL,
	`change_type` text NOT NULL,
	`quantity` integer NOT NULL,
	`timestamp` integer NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_logs`("id", "product_id", "product_name", "product_barcode", "change_type", "quantity", "timestamp") SELECT "id", "product_id", '' AS "product_name", '' AS "product_barcode", "change_type", "quantity", "timestamp" FROM `logs`;--> statement-breakpoint
DROP TABLE `logs`;--> statement-breakpoint
ALTER TABLE `__new_logs` RENAME TO `logs`;--> statement-breakpoint
PRAGMA foreign_keys=ON;