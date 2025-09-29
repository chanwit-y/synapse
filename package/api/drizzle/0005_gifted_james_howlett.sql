CREATE TABLE "note_room" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversationId" varchar(255) NOT NULL,
	"instruction" text NOT NULL,
	"noteId" uuid,
	"createdAt" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "note_room" ADD CONSTRAINT "note_room_noteId_note_id_fk" FOREIGN KEY ("noteId") REFERENCES "public"."note"("id") ON DELETE no action ON UPDATE no action;