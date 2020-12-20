const cars = [{"audi": ["R8", "114"]}, {"bmw": ["X4", "X6"]}]

function renderModell(car) {
  let ModellList = []
  const carList = cars.filter((item) => (car == Object.keys(item)[0]))
  carList[0][car].forEach((item) => {
    ModellList.push({value: item, label: item})
  })

  return ModellList
}


test('returns modells linked to right Car brand', () => {

  expect(renderModell("audi")).toEqual([{value: "R8", label: "R8"}, {value: "114", label: "114"}])
  expect(renderModell("bmw")).toEqual([{value: "X4", label: "X4"}, {value: "X6", label: "X6"}])
})
