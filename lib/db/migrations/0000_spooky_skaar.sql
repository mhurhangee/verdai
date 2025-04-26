CREATE TABLE "user_projects" (
	"project_id" varchar(8) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"project_name" varchar(255) NOT NULL,
	"description" varchar(512),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
