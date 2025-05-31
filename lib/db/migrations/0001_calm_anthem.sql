CREATE TABLE "employees" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "employees_id_pk" PRIMARY KEY("id")
);
