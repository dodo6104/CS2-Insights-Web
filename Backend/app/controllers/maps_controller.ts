import type { HttpContext } from '@adonisjs/core/http'
import Map from '#models/maps'
import Spot from '#models/spots'

export default class MapsController {
  async index({ response }: HttpContext) {
    const maps = await Map.query()
    return response.json(maps)
  }

  async returnSpots({ params, response }: HttpContext) {
    const map = await Map.query().whereILike('name', params.mapName).first()

    if (!map) {
      return response.status(404).json({ message: 'Map not found' })
    }

    const spots = await Spot.query().where('map_id', map.id).preload('positions').preload('map')

    return response.json(spots)
  }
}
