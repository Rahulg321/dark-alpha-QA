DO $$ BEGIN
 CREATE TYPE "userRole" AS ENUM('USER', 'ADMIN');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "User" ADD COLUMN "image" text;

ALTER TABLE "User" ADD COLUMN "role" "userRole" DEFAULT 'USER' NOT NULL;

ALTER TABLE "User" ADD COLUMN "emailVerified" timestamp;

ALTER TABLE "User" ADD COLUMN "facebookUrl" text;

ALTER TABLE "User" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;

ALTER TABLE "User" ADD COLUMN "updatedAt" timestamp DEFAULT now() NOT NULL;