ALTER TABLE "ticket_replies" ADD COLUMN "subject" text NOT NULL;--> statement-breakpoint
ALTER TABLE "ticket_replies" DROP COLUMN "from_name";--> statement-breakpoint
ALTER TABLE "ticket_replies" DROP COLUMN "from_email";--> statement-breakpoint
ALTER TABLE "ticket_replies" DROP COLUMN "tags";--> statement-breakpoint
ALTER TABLE "ticket_replies" DROP COLUMN "description";