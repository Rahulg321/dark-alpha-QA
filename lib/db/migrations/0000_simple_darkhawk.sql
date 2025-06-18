CREATE TABLE "verificationToken" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "verified" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "verificationTokenId" uuid;--> statement-breakpoint
ALTER TABLE "User" ADD CONSTRAINT "User_verificationTokenId_verificationToken_id_fk" FOREIGN KEY ("verificationTokenId") REFERENCES "public"."verificationToken"("id") ON DELETE set null ON UPDATE no action;
