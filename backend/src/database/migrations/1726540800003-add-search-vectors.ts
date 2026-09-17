import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSearchVectors1726540800003 implements MigrationInterface {
  name = 'AddSearchVectors1726540800003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create tsvector columns if not exist (they were created in initial migration)
    // Create GIN indexes for full-text search

    // Leads search vector
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_leads_search_vector" ON "leads" USING GIN ("search_vector")
    `);

    // Customers search vector
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_customers_search_vector" ON "customers" USING GIN ("search_vector")
    `);

    // Properties search vector
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_properties_search_vector" ON "properties" USING GIN ("search_vector")
    `);

    // Create trigger functions to update search vectors automatically
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_leads_search_vector()
      RETURNS trigger AS $$
      BEGIN
        NEW.search_vector :=
          setweight(to_tsvector('english', COALESCE(NEW.requested_location, '')), 'A') ||
          setweight(to_tsvector('english', COALESCE(NEW.requested_property_type, '')), 'B');
        RETURN NEW;
      END
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_customers_search_vector()
      RETURNS trigger AS $$
      BEGIN
        NEW.search_vector :=
          setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
          setweight(to_tsvector('english', COALESCE(NEW.phone, '')), 'B') ||
          setweight(to_tsvector('english', COALESCE(NEW.email, '')), 'C');
        RETURN NEW;
      END
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_properties_search_vector()
      RETURNS trigger AS $$
      BEGIN
        NEW.search_vector :=
          setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
          setweight(to_tsvector('english', COALESCE(NEW.location, '')), 'B') ||
          setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'C');
        RETURN NEW;
      END
      $$ LANGUAGE plpgsql;
    `);

    // Create triggers
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS trigger_update_leads_search_vector ON leads;
      CREATE TRIGGER trigger_update_leads_search_vector
      BEFORE INSERT OR UPDATE ON leads
      FOR EACH ROW EXECUTE FUNCTION update_leads_search_vector();
    `);

    await queryRunner.query(`
      DROP TRIGGER IF EXISTS trigger_update_customers_search_vector ON customers;
      CREATE TRIGGER trigger_update_customers_search_vector
      BEFORE INSERT OR UPDATE ON customers
      FOR EACH ROW EXECUTE FUNCTION update_customers_search_vector();
    `);

    await queryRunner.query(`
      DROP TRIGGER IF EXISTS trigger_update_properties_search_vector ON properties;
      CREATE TRIGGER trigger_update_properties_search_vector
      BEFORE INSERT OR UPDATE ON properties
      FOR EACH ROW EXECUTE FUNCTION update_properties_search_vector();
    `);

    // Backfill existing records
    await queryRunner.query(`
      UPDATE leads SET search_vector =
        setweight(to_tsvector('english', COALESCE(requested_location, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(requested_property_type, '')), 'B')
      WHERE search_vector IS NULL;
    `);

    await queryRunner.query(`
      UPDATE customers SET search_vector =
        setweight(to_tsvector('english', COALESCE(name, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(phone, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(email, '')), 'C')
      WHERE search_vector IS NULL;
    `);

    await queryRunner.query(`
      UPDATE properties SET search_vector =
        setweight(to_tsvector('english', COALESCE(name, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(location, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(description, '')), 'C')
      WHERE search_vector IS NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop triggers
    await queryRunner.query(`DROP TRIGGER IF EXISTS trigger_update_leads_search_vector ON leads;`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS trigger_update_customers_search_vector ON customers;`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS trigger_update_properties_search_vector ON properties;`);

    // Drop functions
    await queryRunner.query(`DROP FUNCTION IF EXISTS update_leads_search_vector();`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS update_customers_search_vector();`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS update_properties_search_vector();`);

    // Drop indexes
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_leads_search_vector";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_customers_search_vector";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_properties_search_vector";`);
  }
}