import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'spots'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary().unsigned().unique()
      table.float('position_x', 10).notNullable()
      table.float('position_y', 10).notNullable()

      table
        .smallint('map_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('maps')
        .onDelete('CASCADE')

      table
        .smallint('grenade_type')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('grenade_types')
        .onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
