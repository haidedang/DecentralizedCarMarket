import dummyInventory from '../util/dummyData/inventory.json'

export function getInventory(req, res) {
  res.json(dummyInventory)
}
