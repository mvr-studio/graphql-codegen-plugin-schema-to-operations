"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const cleanDoc_1 = __importDefault(require("../cleanDoc"));
const _1 = require(".");
const schema = (0, graphql_1.buildSchema)(/* GraphQL */ `
  type Pizza {
    dough: String!
    toppings: [String!]
  }
  type Book {
    id: ID!
    title: String!
  }
  type User {
    id: ID!
    name: String!
    favoritePizza: Pizza!
    favoriteBook: Book!
    favoriteFood: Food!
    shelf: [Book!]!
  }
  interface Salad {
    ingredients: [String!]!
  }
  type CaeserSalad implements Salad {
    ingredients: [String!]!
    additionalParmesan: Boolean!
  }
  type Coleslaw implements Salad {
    ingredients: [String!]!
    asian: Boolean!
  }
  union Food = Pizza | Salad
  type Post {
    comments(filter: String!): [String!]!
  }
  type Query {
    me: User
    user(id: ID!): User
    users: [User!]
    menu: [Food]
    menuByIngredients(ingredients: [String!]!): [Food]
    feed: [Post]
  }
  type Mutation {
    addSalad(ingredients: [String!]!): Salad
    addRandomFood: Food
  }
  type Subscription {
    onFood: Food
  }
  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`);
const models = ['User', 'Book'];
test('should work with Query', () => __awaiter(void 0, void 0, void 0, function* () {
    const document = (0, _1.buildOperationNodeForField)({
        schema,
        kind: 'query',
        field: 'me',
        models,
        ignore: []
    });
    expect((0, cleanDoc_1.default)(document)).toEqual((0, cleanDoc_1.default)(/* GraphQL */ `
      query me_query {
        me {
          id
          name
          favoritePizza {
            dough
            toppings
          }
          favoriteBook {
            id
          }
          favoriteFood {
            ... on Pizza {
              dough
              toppings
            }
            ... on Salad {
              ... on CaeserSalad {
                ingredients
                additionalParmesan
              }
              ... on Coleslaw {
                ingredients
                asian
              }
            }
          }
          shelf {
            id
          }
        }
      }
    `));
}));
test('should work with Query and variables', () => __awaiter(void 0, void 0, void 0, function* () {
    const document = (0, _1.buildOperationNodeForField)({
        schema,
        kind: 'query',
        field: 'user',
        models,
        ignore: []
    });
    expect((0, cleanDoc_1.default)(document)).toEqual((0, cleanDoc_1.default)(/* GraphQL */ `
      query user_query($id: ID!) {
        user(id: $id) {
          id
          name
          favoritePizza {
            dough
            toppings
          }
          favoriteBook {
            id
          }
          favoriteFood {
            ... on Pizza {
              dough
              toppings
            }
            ... on Salad {
              ... on CaeserSalad {
                ingredients
                additionalParmesan
              }
              ... on Coleslaw {
                ingredients
                asian
              }
            }
          }
          shelf {
            id
          }
        }
      }
    `));
}));
test('should work with Query and complicated variable', () => __awaiter(void 0, void 0, void 0, function* () {
    const document = (0, _1.buildOperationNodeForField)({
        schema,
        kind: 'query',
        field: 'menuByIngredients',
        models,
        ignore: []
    });
    expect((0, cleanDoc_1.default)(document)).toEqual((0, cleanDoc_1.default)(/* GraphQL */ `
      query menuByIngredients_query($ingredients: [String!]!) {
        menuByIngredients(ingredients: $ingredients) {
          ... on Pizza {
            dough
            toppings
          }
          ... on Salad {
            ... on CaeserSalad {
              ingredients
              additionalParmesan
            }
            ... on Coleslaw {
              ingredients
              asian
            }
          }
        }
      }
    `));
}));
test('should work with Union', () => __awaiter(void 0, void 0, void 0, function* () {
    const document = (0, _1.buildOperationNodeForField)({
        schema,
        kind: 'query',
        field: 'menu',
        models,
        ignore: []
    });
    expect((0, cleanDoc_1.default)(document)).toEqual((0, cleanDoc_1.default)(/* GraphQL */ `
      query menu_query {
        menu {
          ... on Pizza {
            dough
            toppings
          }
          ... on Salad {
            ... on CaeserSalad {
              ingredients
              additionalParmesan
            }
            ... on Coleslaw {
              ingredients
              asian
            }
          }
        }
      }
    `));
}));
test('should work with mutation', () => __awaiter(void 0, void 0, void 0, function* () {
    const document = (0, _1.buildOperationNodeForField)({
        schema,
        kind: 'mutation',
        field: 'addSalad',
        models,
        ignore: []
    });
    expect((0, cleanDoc_1.default)(document)).toEqual((0, cleanDoc_1.default)(/* GraphQL */ `
      mutation addSalad_mutation($ingredients: [String!]!) {
        addSalad(ingredients: $ingredients) {
          ... on CaeserSalad {
            ingredients
            additionalParmesan
          }
          ... on Coleslaw {
            ingredients
            asian
          }
        }
      }
    `));
}));
test('should work with mutation + return a field of type Query', () => __awaiter(void 0, void 0, void 0, function* () {
    const schema = (0, graphql_1.buildSchema)(/* GraphQL */ `
    type Pizza {
      dough: String!
      toppings: [String!]
      query: Query
    }
    type Query {
      pizza: Pizza
      pizzaById(id: String!): Pizza
    }
    type Mutation {
      addPizza(name: String!): Pizza
    }
  `);
    const document = (0, _1.buildOperationNodeForField)({
        schema,
        kind: 'mutation',
        field: 'addPizza',
        models,
        ignore: []
    });
    expect((0, cleanDoc_1.default)(document)).toEqual((0, cleanDoc_1.default)(/* GraphQL */ `
      mutation addPizza_mutation($name: String!) {
        addPizza(name: $name) {
          dough
          toppings
        }
      }
    `));
}));
test('should work with mutation + Union + return a field of type Query', () => __awaiter(void 0, void 0, void 0, function* () {
    const schema = (0, graphql_1.buildSchema)(/* GraphQL */ `
    type Pizza {
      dough: String!
      toppings: [String!]
      query: Query
    }
    type Salad {
      ingredients: [String!]!
      query: Query
    }
    union Food = Pizza | Salad
    type Query {
      pizza: Pizza
      getPizzaById(id: String!): Pizza
    }
    type Mutation {
      addRandomFood(name: String!): Food
    }
  `);
    const document = (0, _1.buildOperationNodeForField)({
        schema,
        kind: 'mutation',
        field: 'addRandomFood',
        models,
        ignore: []
    });
    expect((0, cleanDoc_1.default)(document)).toEqual((0, cleanDoc_1.default)(/* GraphQL */ `
      mutation addRandomFood_mutation($name: String!) {
        addRandomFood(name: $name) {
          ... on Pizza {
            dough
            toppings
          }
          ... on Salad {
            ingredients
          }
        }
      }
    `));
}));
test('should work with mutation and unions', () => __awaiter(void 0, void 0, void 0, function* () {
    const document = (0, _1.buildOperationNodeForField)({
        schema,
        kind: 'mutation',
        field: 'addRandomFood',
        models,
        ignore: []
    });
    expect((0, cleanDoc_1.default)(document)).toEqual((0, cleanDoc_1.default)(/* GraphQL */ `
      mutation addRandomFood_mutation {
        addRandomFood {
          ... on Pizza {
            dough
            toppings
          }
          ... on Salad {
            ... on CaeserSalad {
              ingredients
              additionalParmesan
            }
            ... on Coleslaw {
              ingredients
              asian
            }
          }
        }
      }
    `));
}));
test('should work with Query and nested variables', () => __awaiter(void 0, void 0, void 0, function* () {
    const document = (0, _1.buildOperationNodeForField)({
        schema,
        kind: 'query',
        field: 'feed',
        models,
        ignore: []
    });
    expect((0, cleanDoc_1.default)(document)).toEqual((0, cleanDoc_1.default)(/* GraphQL */ `
      query feed_query($feed_comments_filter: String!) {
        feed {
          comments(filter: $feed_comments_filter)
        }
      }
    `));
}));
test('should be able to ignore using models when requested', () => __awaiter(void 0, void 0, void 0, function* () {
    const document = (0, _1.buildOperationNodeForField)({
        schema,
        kind: 'query',
        field: 'user',
        models,
        ignore: ['User.favoriteBook', 'User.shelf']
    });
    expect((0, cleanDoc_1.default)(document)).toEqual((0, cleanDoc_1.default)(/* GraphQL */ `
      query user_query($id: ID!) {
        user(id: $id) {
          id
          name
          favoritePizza {
            dough
            toppings
          }
          favoriteBook {
            id
            title
          }
          favoriteFood {
            ... on Pizza {
              dough
              toppings
            }
            ... on Salad {
              ... on CaeserSalad {
                ingredients
                additionalParmesan
              }
              ... on Coleslaw {
                ingredients
                asian
              }
            }
          }
          shelf {
            id
            title
          }
        }
      }
    `));
}));
test('should work with Subscription', () => __awaiter(void 0, void 0, void 0, function* () {
    const document = (0, _1.buildOperationNodeForField)({
        schema,
        kind: 'subscription',
        field: 'onFood',
        models,
        ignore: []
    });
    expect((0, cleanDoc_1.default)(document)).toEqual((0, cleanDoc_1.default)(/* GraphQL */ `
      subscription onFood_subscription {
        onFood {
          ... on Pizza {
            dough
            toppings
          }
          ... on Salad {
            ... on CaeserSalad {
              ingredients
              additionalParmesan
            }
            ... on Coleslaw {
              ingredients
              asian
            }
          }
        }
      }
    `));
}));
test('should work with circular ref (default depth limit === 1)', () => __awaiter(void 0, void 0, void 0, function* () {
    const document = (0, _1.buildOperationNodeForField)({
        schema: (0, graphql_1.buildSchema)(/* GraphQL */ `
      type A {
        b: B
      }
      type B {
        c: C
      }
      type C {
        end: String
        a: A
      }
      type Query {
        a: A
      }
    `),
        kind: 'query',
        field: 'a',
        models,
        ignore: []
    });
    expect((0, cleanDoc_1.default)(document)).toEqual((0, cleanDoc_1.default)(/* GraphQL */ `
      query a_query {
        a {
          b {
            c {
              end
            }
          }
        }
      }
    `));
}));
test('should work with circular ref (custom depth limit)', () => __awaiter(void 0, void 0, void 0, function* () {
    const document = (0, _1.buildOperationNodeForField)({
        schema: (0, graphql_1.buildSchema)(/* GraphQL */ `
      type A {
        b: B
      }
      type B {
        c: C
      }
      type C {
        end: String
        a: A
      }
      type Query {
        a: A
      }
    `),
        kind: 'query',
        field: 'a',
        models,
        ignore: [],
        circularReferenceDepth: 2
    });
    expect((0, cleanDoc_1.default)(document)).toEqual((0, cleanDoc_1.default)(/* GraphQL */ `
      query a_query {
        a {
          b {
            c {
              end
              a {
                b {
                  c {
                    end
                  }
                }
              }
            }
          }
        }
      }
    `));
}));
test('arguments', () => __awaiter(void 0, void 0, void 0, function* () {
    const document = (0, _1.buildOperationNodeForField)({
        schema: (0, graphql_1.buildSchema)(/* GraphQL */ `
      input PageInfoInput {
        offset: Int!
        limit: Int!
      }
      type User {
        id: ID
        name: String
      }
      type Query {
        users(pageInfo: PageInfoInput!): [User]
      }
    `),
        kind: 'query',
        field: 'users',
        models,
        ignore: []
    });
    expect((0, cleanDoc_1.default)(document)).toEqual((0, cleanDoc_1.default)(/* GraphQL */ `
      query users_query($pageInfo: PageInfoInput!) {
        users(pageInfo: $pageInfo) {
          id
          name
        }
      }
    `));
}));
test('selectedFields', () => __awaiter(void 0, void 0, void 0, function* () {
    const document = (0, _1.buildOperationNodeForField)({
        schema,
        kind: 'query',
        field: 'user',
        selectedFields: {
            favoriteFood: {
                dough: true,
                toppings: true,
                asian: true
            },
            shelf: true // Add all nested fields
        }
    });
    expect((0, cleanDoc_1.default)(document)).toEqual((0, cleanDoc_1.default)(/* GraphQL */ `
      query user_query($id: ID!) {
        user(id: $id) {
          favoriteFood {
            ... on Pizza {
              dough
              toppings
            }
            ... on Salad {
              ... on Coleslaw {
                asian
              }
            }
          }
          shelf {
            id
            title
          }
        }
      }
    `));
}));
