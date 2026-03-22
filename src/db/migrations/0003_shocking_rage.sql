ALTER TABLE "transactions" DROP COLUMN "is_recurring";--> statement-breakpoint
ALTER TABLE "transactions" DROP COLUMN "recurring_interval";--> statement-breakpoint
ALTER TABLE "transactions" DROP COLUMN "recurring_end_date";--> statement-breakpoint
ALTER TABLE "transactions" DROP COLUMN "total_installments";--> statement-breakpoint
ALTER TABLE "transactions" DROP COLUMN "current_installment";--> statement-breakpoint
DROP TYPE "public"."recurring_interval";