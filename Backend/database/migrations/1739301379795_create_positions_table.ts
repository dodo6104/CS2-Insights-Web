import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'positions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary().unsigned().unique()
      table.string('name', 20).notNullable()
      table.string('description', 255)
      table.float('key_time', 10).notNullable()
      table.float('position_x', 10).notNullable()
      table.float('position_y', 10).notNullable()
      table
        .smallint('spot_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('spots')
        .onDelete('CASCADE')
      table.string('source', 255).unique()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
