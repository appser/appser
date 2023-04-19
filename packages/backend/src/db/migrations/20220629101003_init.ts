import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .createTable('user', t => {
      t.bigint('id').primary().unsigned()
      t.string('avatar')
      t.string('nickname')
      t.boolean('is_external')
      t.specificType('roles', 'bigint[]')
      t.jsonb('account')
      t.timestamp('last_login_at').notNullable()
      t.timestamps(true, true)
    })
    .createTable('model', t => {
      t.bigint('table_id').primary()
      t.string('name')
      t.bigint('creator_id')
      t.timestamps(true, true)
    })
    .createTable('role', t => {
      t.bigint('id').primary()
      t.string('name')
      t.bigint('creator_id')
      t.timestamps(true, true)
    })
    .createTable('table_meta', t => {
      t.bigint('id').primary()
      t.string('name')
      t.timestamps(true, true)
    })
    .createTable('rule', t => {
      t.bigint('id').primary()
      t.bigint('role_id')
      t.bigint('user_id')
      t.bigint('token_id')
      t.text('action')
      t.text('subject')
      t.boolean('inverted')
      t.specificType('fields', 'text[]')
      t.jsonb('conditions')
    })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('user').dropTable('model').dropTable('table_meta').dropTable('role').dropTable('rule')
}
