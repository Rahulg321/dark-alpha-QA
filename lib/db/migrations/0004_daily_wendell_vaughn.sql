CREATE TABLE "answers" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"company_question_id" uuid NOT NULL,
	"answer" text NOT NULL,
	"type" varchar DEFAULT 'AI_GENERATED' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "answers_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "company_questions" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"title" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "company_questions_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
ALTER TABLE "answers" ADD CONSTRAINT "answers_company_question_id_company_questions_id_fk" FOREIGN KEY ("company_question_id") REFERENCES "public"."company_questions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_questions" ADD CONSTRAINT "company_questions_company_id_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."company"("id") ON DELETE no action ON UPDATE no action;