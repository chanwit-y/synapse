ALTER TABLE "note_chunk" ADD COLUMN "language" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "note_chunk" ADD COLUMN "content" text NOT NULL;--> statement-breakpoint
ALTER TABLE "note" ADD COLUMN "language" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "note" ADD COLUMN "content" text NOT NULL;--> statement-breakpoint
ALTER TABLE "note_chunk" DROP COLUMN "contentTH";--> statement-breakpoint
ALTER TABLE "note_chunk" DROP COLUMN "contentEN";--> statement-breakpoint
ALTER TABLE "note" DROP COLUMN "contentTH";--> statement-breakpoint
ALTER TABLE "note" DROP COLUMN "contentEN";