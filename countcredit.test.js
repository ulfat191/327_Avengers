const countcredit = require('./countcredit')

test('Counts credits by adding them', () => {
    expect(countcredit(51,13)).toBe(64),
    expect(countcredit(5,10)).toBe(15),
    expect(countcredit(5,3)).toBe(8)
})