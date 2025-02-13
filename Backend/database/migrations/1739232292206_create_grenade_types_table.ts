import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'grenade_types'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary().unsigned().unique()
      table.string('type', 10).notNullable().unique()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
