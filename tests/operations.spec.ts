import fs from 'fs'
import path from 'path'

test('matches the operations.graphql snapshot', () => {
  const operationsGql = fs.readFileSync(path.resolve(__dirname, 'operations.graphql'), 'utf8')
  expect(operationsGql).toMatchSnapshot()
})
