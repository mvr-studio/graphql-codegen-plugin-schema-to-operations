# GraphQL Codegen Plugin Schema To Operations

Easily generate GraphQL operations for provided schema. Our motivation was to create the plugin to create operations for further processing by GraphQL Codegen (in our case to generate SWR and graphql-request SDK out of the box for basic CRUD operations).

## Installation

Install the module:

```bash
$ yarn add @mvr-studio/graphql-codegen-plugin-schema-to-operations
```

Add it to your codegen.yaml:

```yaml
generates:
  operations.graphql:
    schema: ./schema.graphql # or external address pointing to schema
    plugins:
      - '@mvr-studio/graphql-codegen-plugin-schema-to-operations'
```

That's it. Now you can run the codegen.

## Usage

The plugin will likely transform given schema:

```gql
scalar Date

type AuthResponse {
  jwt: String!
}

type Mutation {
  logInUser(email: String!, password: String!): AuthResponse
}

type Query {
  me: User
}

enum Role {
  ADMIN
  USER
}

type User {
  id: String!
  email: String!
  name: String
  role: Role
  createdAt: Date!
  updatedAt: Date!
}
```

Into following operations:

```gql
query me_query {
  me {
    createdAt
    email
    id
    name
    role
    updatedAt
  }
}

mutation logInUser_mutation($email: String!, $password: String!) {
  logInUser(email: $email, password: $password) {
    jwt
  }
}
```

## Additional Config

### depthLimit

By default the plugin fetches fields for `depthLimit=1` depth. But the property is adjustable like:

```yaml
generates:
  operations.graphql:
    schema: ./schema.graphql # or external address pointing to schema
    plugins:
      - '@mvr-studio/graphql-codegen-plugin-schema-to-operations'
        depthLimit: 3
```

## Credits

[graphql-tools](https://github.com/ardatan/graphql-tools) - Thanks for the [schema processor](https://github.com/ardatan/graphql-tools/blob/master/packages/utils/src/build-operation-for-field.ts)
