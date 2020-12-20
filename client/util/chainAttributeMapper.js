// see RideCore.sol and inventory.json to see what is being mapped
export function mapChainSales(sales, inventory) {
  const mappedSales = sales
  sales.forEach((sale, salesIndex) => {
    let manufacturerId
    sale.forEach((attribute, attributesIndex) => {
      // manufacturer
      if (attributesIndex === 4) {
        manufacturerId = attribute
        mappedSales[salesIndex][attributesIndex] = inventory.brands[manufacturerId].name
      }

      // model
      if (attributesIndex === 5) {
        const modelId = attribute
        mappedSales[salesIndex][attributesIndex] = inventory.brands[manufacturerId].models[modelId]
      }
    })
  })
  return sales
}

export function mapCars(cars, inventory) {
  const mappedCars = cars
  cars.forEach((car, carIndex) => {
    let manufacturerId
    car.forEach((attribute, attributesIndex) => {
      // manufacturer
      if (attributesIndex === 1) {
        manufacturerId = attribute
        mappedCars[carIndex][attributesIndex] = inventory.brands[manufacturerId].name
      }

      // model
      if (attributesIndex === 2) {
        const modelId = attribute
        mappedCars[carIndex][attributesIndex] = inventory.brands[manufacturerId].models[modelId]
      }
    })
  })
  return cars
}

// modelid mileage accidentscount

export function mapCarObjects(cars) {
  return cars.map(car => mapCarObject(car))
}

function mapCarObject(car) {
  return {
    carId: car[0],
    manufacturer: car[1],
    model: car[2],
    mileage: car[3],
    accident: car[4],
  }
}

export function mapSalesObjects(sales) {
  return sales.map(sale => mapSalesObject(sale))
}

function mapSalesObject(sale) {
  return {
    owner: sale[0],
    bidder: sale[1],
    price: sale[2],
    manufacturer: sale[4],
    model: sale[5],
    mileage: sale[6],
    accidents: sale[7],
    creationTime: sale[8],
    carId: sale[sale.length - 1],
  }
}
