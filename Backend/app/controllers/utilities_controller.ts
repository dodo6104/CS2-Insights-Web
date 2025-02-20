import type { HttpContext } from '@adonisjs/core/http'

export default class UtilitiesController {
  public async addUtil({ request, response }: HttpContext) {
    console.log(request.only(['x', 'y']))
    return 0
  }
}
