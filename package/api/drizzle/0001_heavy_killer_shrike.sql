ALTER TABLE "note_chunk" RENAME COLUMN "content" TO "contentTH";--> statement-breakpoint
ALTER TABLE "note_chunk" ADD COLUMN "contentEN" text NOT NULL;