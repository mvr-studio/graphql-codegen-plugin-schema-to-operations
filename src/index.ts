import { Types } from '@graphql-codegen/plugin-helpers'
import { GraphQLSchema, OperationTypeNode } from 'graphql'
import { buildOperationNodeForField } from './utils/buildOperationForField'
import cleanDoc from './utils/cleanDoc'

interface Config {
  depthLimit?: number
}

module.exports = {
  plugin: (schema: GraphQLSchema, _documents: Types.DocumentFile[], config: Config) => {
    const queryFields = Object.keys(schema.getQueryType()?.['_fields'])
    const mutationFields = Object.keys(schema.getMutationType()?.['_fields'])
    const queries = queryFields
      .map((queryName) =>
        cleanDoc(
          buildOperationNodeForField({
            schema,
            kind: 'query' as OperationTypeNode,
            field: queryName,
            depthLimit: config.depthLimit || 1
          })
        )
      )
      .join('\n')
    const mutations = mutationFields
      .map((mutationName) =>
        cleanDoc(
          buildOperationNodeForField({
            schema,
            kind: 'mutation' as OperationTypeNode,
            field: mutationName,
            depthLimit: config.depthLimit || 1
          })
        )
      )
      .join('\n')
    return [queries, mutations].join('\n')
  }
}
