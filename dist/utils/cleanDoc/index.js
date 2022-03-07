"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const cleanDoc = (doc) => (0, graphql_1.print)(typeof doc === 'string' ? (0, graphql_1.parse)(doc) : doc).trim();
exports.default = cleanDoc;
