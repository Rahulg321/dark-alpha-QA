CREATE TABLE "comparison_questions" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"user_query" text NOT NULL,
	"resource_ids" uuid[] NOT NULL,
	"answer" text NOT NULL,
	"company_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "comparison_questions_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
ALTER TABLE "comparison_questions" ADD CONSTRAINT "comparison_questions_company_id_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."company"("id") ON DELETE no action ON UPDATE no action;