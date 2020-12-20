export function filterSalesByBrand(sales, brand) {
  // atm hard coded from inventory
  const brandIndex = 4
  const filteredSales = []
  if (!brand) {
    return sales
  }
  sales.forEach(sale => {
    if (sale[brandIndex] === brand) {
      filteredSales.push(sale)
    }
  })
  return filteredSales
}

export function filterSalesByModel(sales, model) {
  // atm hard coded from inventory
  const modelIndex = 5
  const filteredSales = []
  if (!model) {
    return sales
  }
  sales.forEach(sale => {
    if (sale[modelIndex] === model) {
      filteredSales.push(sale)
    }
  })
  return filteredSales
}
