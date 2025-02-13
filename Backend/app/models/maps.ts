import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Map extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string
}
