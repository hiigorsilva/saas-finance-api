ALTER TABLE "transactions" ALTER COLUMN "payment_method" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."payment_method";--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('CREDIT_CARD', 'DEBIT_CARD', 'BANK_SLIP', 'PIX', 'CASH', 'OTHER');--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "payment_method" SET DATA TYPE "public"."payment_method" USING "payment_method"::"public"."payment_method";--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "payment_method" "payment_method" NOT NULL;