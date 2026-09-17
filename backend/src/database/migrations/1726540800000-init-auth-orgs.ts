import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitAuthOrgs1726540800000 implements MigrationInterface {
  name = 'InitAuthOrgs1726540800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enum type for member roles
    await queryRunner.query(`
      CREATE TYPE "public"."member_role_enum" AS ENUM ('owner', 'admin', 'manager', 'agent')
    `);

    // users
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "email" character varying(255) NOT NULL,
        "name" character varying(120) NOT NULL,
        "password_hash" character varying(255) NOT NULL,
        "email_verified_at" TIMESTAMP WITH TIME ZONE,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_users" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_users_email" UNIQUE ("email")
      )
    `);

    // organizations
    await queryRunner.query(`
      CREATE TABLE "organizations" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "name" character varying(120) NOT NULL,
        "currency" character varying(3) NOT NULL DEFAULT 'USD',
        "timezone" character varying(50) NOT NULL DEFAULT 'UTC',
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_organizations" PRIMARY KEY ("id")
      )
    `);

    // organization_members
    await queryRunner.query(`
      CREATE TABLE "organization_members" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "organization_id" uuid NOT NULL,
        "user_id" uuid NOT NULL,
        "role" "public"."member_role_enum" NOT NULL,
        "restricted_to_own_records" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_organization_members" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_org_member" UNIQUE ("organization_id", "user_id"),
        CONSTRAINT "FK_org_member_org" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_org_member_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_org_member_user" ON "organization_members" ("user_id")
    `);

    // organization_settings
    await queryRunner.query(`
      CREATE TABLE "organization_settings" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "organization_id" uuid NOT NULL,
        "settings" jsonb NOT NULL DEFAULT '{}',
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_organization_settings" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_org_settings" UNIQUE ("organization_id"),
        CONSTRAINT "FK_org_settings_org" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE
      )
    `);

    // refresh_tokens
    await queryRunner.query(`
      CREATE TABLE "refresh_tokens" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "token_hash" character varying(64) NOT NULL,
        "family_id" character varying(32) NOT NULL,
        "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL,
        "revoked_at" TIMESTAMP WITH TIME ZONE,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_refresh_tokens" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_refresh_token_hash" UNIQUE ("token_hash"),
        CONSTRAINT "FK_refresh_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_refresh_user" ON "refresh_tokens" ("user_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_refresh_family" ON "refresh_tokens" ("family_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_refresh_family"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_refresh_user"`);
    await queryRunner.query(`DROP TABLE "refresh_tokens"`);
    await queryRunner.query(`DROP TABLE "organization_settings"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_org_member_user"`);
    await queryRunner.query(`DROP TABLE "organization_members"`);
    await queryRunner.query(`DROP TABLE "organizations"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."member_role_enum"`);
  }
}