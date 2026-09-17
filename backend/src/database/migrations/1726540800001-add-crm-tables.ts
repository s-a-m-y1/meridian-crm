import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCrmTables1726540800001 implements MigrationInterface {
  name = 'AddCrmTables1726540800001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create customers table first (referenced by leads)
    await queryRunner.query(`
      CREATE TABLE "customers" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "organization_id" uuid NOT NULL,
        "name" character varying(120) NOT NULL,
        "phone" character varying(30),
        "email" character varying(255),
        "search_vector" tsvector,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_customers" PRIMARY KEY ("id"),
        CONSTRAINT "FK_customers_org" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_customers_org" ON "customers" ("organization_id")
    `);

    // Create leads table
    await queryRunner.query(`
      CREATE TABLE "leads" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "organization_id" uuid NOT NULL,
        "customer_id" uuid,
        "owner_id" uuid NOT NULL,
        "status" character varying(20) NOT NULL DEFAULT 'NEW',
        "source" character varying(20),
        "budget_min" numeric(12,2),
        "budget_max" numeric(12,2),
        "requested_property_type" character varying(50),
        "requested_location" character varying(120),
        "search_vector" tsvector,
        "ai_score" integer,
        "ai_classification" character varying(10),
        "ai_score_reasons" jsonb,
        "ai_scored_at" TIMESTAMP WITH TIME ZONE,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_leads" PRIMARY KEY ("id"),
        CONSTRAINT "FK_leads_org" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_leads_customer" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE SET NULL,
        CONSTRAINT "FK_leads_owner" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_leads_org" ON "leads" ("organization_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_leads_owner" ON "leads" ("owner_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_leads_customer" ON "leads" ("customer_id")
    `);

    // Properties table
    await queryRunner.query(`
      CREATE TABLE "properties" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "organization_id" uuid NOT NULL,
        "name" character varying(120) NOT NULL,
        "description" text,
        "category" character varying(20) NOT NULL DEFAULT 'APARTMENT',
        "price" numeric(12,2),
        "bedrooms" integer,
        "location" character varying(120),
        "status" character varying(20) NOT NULL DEFAULT 'AVAILABLE',
        "search_vector" tsvector,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_properties" PRIMARY KEY ("id"),
        CONSTRAINT "FK_properties_org" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_properties_org" ON "properties" ("organization_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_properties_status" ON "properties" ("status")
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_properties_category" ON "properties" ("category")
    `);

    // Deals table
    await queryRunner.query(`
      CREATE TABLE "deals" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "organization_id" uuid NOT NULL,
        "lead_id" uuid NOT NULL,
        "owner_id" uuid NOT NULL,
        "property_id" uuid,
        "value" numeric(12,2) NOT NULL,
        "stage" character varying(30) NOT NULL DEFAULT 'PROSPECTING',
        "closed_at" TIMESTAMP WITH TIME ZONE,
        "ai_close_probability" integer,
        "ai_forecast_updated_at" TIMESTAMP WITH TIME ZONE,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_deals" PRIMARY KEY ("id"),
        CONSTRAINT "FK_deals_org" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_deals_lead" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_deals_owner" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_deals_property" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_deals_org" ON "deals" ("organization_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_deals_lead" ON "deals" ("lead_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_deals_owner" ON "deals" ("owner_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_deals_property" ON "deals" ("property_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_deals_stage" ON "deals" ("stage")
    `);

    // Tasks table
    await queryRunner.query(`
      CREATE TABLE "tasks" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "organization_id" uuid NOT NULL,
        "owner_id" uuid NOT NULL,
        "lead_id" uuid,
        "title" character varying(200) NOT NULL,
        "description" text,
        "due_at" TIMESTAMP WITH TIME ZONE,
        "status" character varying(20) NOT NULL DEFAULT 'PENDING',
        "completed_at" TIMESTAMP WITH TIME ZONE,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_tasks" PRIMARY KEY ("id"),
        CONSTRAINT "FK_tasks_org" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_tasks_owner" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_tasks_lead" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_tasks_org" ON "tasks" ("organization_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_tasks_owner" ON "tasks" ("owner_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_tasks_lead" ON "tasks" ("lead_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_tasks_status" ON "tasks" ("status")
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_tasks_due" ON "tasks" ("due_at")
    `);

    // Activities table
    await queryRunner.query(`
      CREATE TABLE "activities" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "organization_id" uuid NOT NULL,
        "lead_id" uuid NOT NULL,
        "user_id" uuid NOT NULL,
        "type" character varying(20) NOT NULL,
        "content" text NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_activities" PRIMARY KEY ("id"),
        CONSTRAINT "FK_activities_org" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_activities_lead" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_activities_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_activities_org" ON "activities" ("organization_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_activities_lead" ON "activities" ("lead_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_activities_user" ON "activities" ("user_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_activities_type" ON "activities" ("type")
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_activities_created" ON "activities" ("created_at")
    `);

    // Notes table
    await queryRunner.query(`
      CREATE TABLE "notes" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "organization_id" uuid NOT NULL,
        "lead_id" uuid NOT NULL,
        "user_id" uuid NOT NULL,
        "content" text NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_notes" PRIMARY KEY ("id"),
        CONSTRAINT "FK_notes_org" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_notes_lead" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_notes_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_notes_org" ON "notes" ("organization_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_notes_lead" ON "notes" ("lead_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_notes_user" ON "notes" ("user_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "notes";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "activities";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "tasks";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "deals";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "properties";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "leads";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "customers";`);
  }
}
