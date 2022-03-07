"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const buildOperationForField_1 = require("./utils/buildOperationForField");
const cleanDoc_1 = __importDefault(require("./utils/cleanDoc"));
module.exports = {
    plugin: (schema, _documents, config) => {
        var _a, _b;
        const queryFields = Object.keys((_a = schema.getQueryType()) === null || _a === void 0 ? void 0 : _a['_fields']);
        const mutationFields = Object.keys((_b = schema.getMutationType()) === null || _b === void 0 ? void 0 : _b['_fields']);
        const queries = queryFields
            .map((queryName) => (0, cleanDoc_1.default)((0, buildOperationForField_1.buildOperationNodeForField)({
            schema,
            kind: 'query',
            field: queryName,
            depthLimit: config.depthLimit || 1
        })))
            .join('\n\n');
        const mutations = mutationFields
            .map((mutationName) => (0, cleanDoc_1.default)((0, buildOperationForField_1.buildOperationNodeForField)({
            schema,
            kind: 'mutation',
            field: mutationName,
            depthLimit: config.depthLimit || 1
        })))
            .join('\n\n');
        return [queries, mutations].join('\n\n').concat('\n');
    }
};
