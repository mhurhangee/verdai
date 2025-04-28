CREATE TABLE "feedback" (
	"id" varchar(12) PRIMARY KEY NOT NULL,
	"user_id" varchar(255),
	"page" varchar(255),
	"message" varchar(2048) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
