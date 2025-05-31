ALTER TABLE "resources" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "resources" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "resources" ADD COLUMN "kind" varchar DEFAULT 'pdf' NOT NULL;