import { Router } from 'express'
import * as InventoryController from '../controllers/inventory.controller'

const router = new Router()

// Get inventory
router.route('/inventory')
  .get(InventoryController.getInventory)

export default router
