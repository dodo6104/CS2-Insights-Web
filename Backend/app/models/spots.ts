import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Map from './maps.js'
import GrenadeType from './grenade_types.js'
import Position from './position.js'

export default class Spot extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare positionX: number

  @column()
  declare positionY: number

  @column()
  declare mapId: number

  @column()
  declare grenadeTypeId: number

  @belongsTo(() => Map, { foreignKey: 'mapId' })
  declare map: BelongsTo<typeof Map>

  @belongsTo(() => GrenadeType, { foreignKey: 'grenadeTypeId' })
  declare grenadeType: BelongsTo<typeof GrenadeType>

  @hasMany(() => Position, { foreignKey: 'spotId' })
  declare positions: HasMany<typeof Position>
}
