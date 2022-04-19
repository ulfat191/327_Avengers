const calculateCGPA = require('./calculateCGPA')

test('Calculate CGPA', () => {
  expect(calculateCGPA(3, 1)).toBe(4)
})
