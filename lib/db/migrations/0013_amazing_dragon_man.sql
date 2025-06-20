DO $$ BEGIN
  ALTER TABLE "Ticket" RENAME COLUMN "from_email" TO "from_name";
EXCEPTION
  WHEN undefined_column THEN
    -- already renamed / never existed
END $$;
