import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Spot from './spots.js'

export default class Position extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string

  @column()
  declare spotId: number

  @column()
  declare source: string

  @column()
  declare key_time: number

  @column()
  declare positionX: number

  @column()
  declare positionY: number

  @belongsTo(() => Spot, { foreignKey: 'spotId' })
  declare spot: BelongsTo<typeof Spot>
}
