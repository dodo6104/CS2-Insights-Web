import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'maps'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').unsigned().unique()
      table.string('name', 10).notNullable().unique()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
