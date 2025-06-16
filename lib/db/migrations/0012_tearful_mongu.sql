ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_userId_User_id_fk";
--> statement-breakpoint
ALTER TABLE "Ticket" ADD COLUMN "type" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "Ticket" ADD COLUMN "priority" varchar DEFAULT 'low' NOT NULL;--> statement-breakpoint
ALTER TABLE "Ticket" ADD COLUMN "from_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "Ticket" ADD COLUMN "from_email" text NOT NULL;--> statement-breakpoint
ALTER TABLE "Ticket" DROP COLUMN "userId";