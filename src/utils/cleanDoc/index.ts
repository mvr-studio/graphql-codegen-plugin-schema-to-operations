import { print, parse, ASTNode } from 'graphql'

const cleanDoc = (doc: string | ASTNode) => print(typeof doc === 'string' ? parse(doc) : doc).trim()

export default cleanDoc
