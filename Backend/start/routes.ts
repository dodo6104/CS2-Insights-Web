/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { Application } from '@adonisjs/core/app'
import app from '@adonisjs/core/services/app'
import router from '@adonisjs/core/services/router'
import { createReadStream } from 'node:fs'

const MapsController = () => import('#controllers/maps_controller')

router.get('maps', [MapsController, 'index'])

router.get('/map/:mapName', async ({ params, response }) => {
  const filePath = app.makePath('public', 'maps', params.mapName + '.png')
  try {
    return response.stream(createReadStream(filePath))
  } catch {
    return response.status(404).send('Image not found')
  }
})
router.get('/map-data/:mapName', [MapsController, 'returnSpots'])

router.get('/video/:mapName/:positionName', async ({ params, response }) => {
  const filePath = app.makePath('public', 'smokes', params.mapName, params.positionName + '.mp4')
  return response.download(filePath)
})
