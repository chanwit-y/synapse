ALTER TABLE "note" RENAME COLUMN "content" TO "contentTH";--> statement-breakpoint
ALTER TABLE "note" ADD COLUMN "contentEN" text NOT NULL;