/* eslint-env jest */
import format from './messageFormat'

const data = {
  name: 'Fabien',
  age: '31',
  siblings: 2,
  birthday: '1988-04-25T00:00:00.000Z',
  lotery: 23292.23,
}

it('should return the message if there is no statement', () => {
  expect(format('Quel est ton nom ?', data))
    .toEqual('Quel est ton nom ?')
})

it('should replace name and age', () => {
  expect(format("Mon nom est {name} et j'ai {age} ans", data))
    .toEqual('Mon nom est Fabien et j\'ai 31 ans')
})

it.skip('should not replace name (escape char)', () => {
  expect(format("Mon nom est '{name}' et j'ai {age} ans", data))
    .toEqual('Mon nom est \'{name}\' et j\'ai 31 ans')
})

it('should replace unknown fields with an empty string', () => {
  expect(format("Mon nom est {name} et j'ai {unknown} ans", data))
    .toEqual('Mon nom est Fabien et j\'ai  ans')
})

it('should replace date', () => {
  expect(format('Mon nom est {name} et je suis né le {birthday, date}', data, 'fr'))
    .toEqual('Mon nom est Fabien et je suis né le 4/25/1988')
})

it('should replace currency', () => {
  expect(format("Mon nom est {name} et j'ai gagné {lotery, currency, EUR}", data))
    .toEqual('Mon nom est Fabien et j\'ai gagné €23,292.23')
})


it('should replace number', () => {
  expect(format("Mon nom est {name} et j'ai gagné {lotery, number}", data))
    .toEqual('Mon nom est Fabien et j\'ai gagné 23,292.23')
})

it.skip('should replace plurals', () => {
  expect(format(
    'I can do plurals: {siblings, plural, =0 {no sibling}, =1 {one sibling}, other {# siblings}}',
    data,
  )).toEqual('I can do plurals: 2 siblings')
})
