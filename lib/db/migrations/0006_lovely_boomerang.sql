CREATE TABLE "resource_categories" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "resource_categories_id_pk" PRIMARY KEY("id"),
	CONSTRAINT "resource_categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "employees" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "employees" CASCADE;--> statement-breakpoint
ALTER TABLE "resources" ADD COLUMN "category_id" uuid;--> statement-breakpoint
ALTER TABLE "resources" ADD COLUMN "tags" text[];--> statement-breakpoint
ALTER TABLE "resources" ADD CONSTRAINT "resources_category_id_resource_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."resource_categories"("id") ON DELETE no action ON UPDATE no action;