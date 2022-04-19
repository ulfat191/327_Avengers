const { sum, mul, sub, div } = require('./login')

test('login admin authentication == TRUE', () => {
  expect(sum(1, 1)).toBe(2)
})
test('login student authentication == TRUE', () => {
  expect(mul(1, 1)).toBe(1)
})
test('logen faculty authe', () => {
  expect(sub(1, 1)).toBe(0)
})
