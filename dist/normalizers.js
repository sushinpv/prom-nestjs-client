"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeStatusCode = exports.normalizePath = void 0;
const url = __importStar(require("url"));
const url_value_parser_1 = __importDefault(require("url-value-parser"));
function normalizePath(originalUrl, extraMasks = [], placeholder = "#val") {
    const { pathname } = url.parse(originalUrl);
    const urlParser = new url_value_parser_1.default({ extraMasks });
    return urlParser.replacePathValues(pathname || "", placeholder);
}
exports.normalizePath = normalizePath;
function normalizeStatusCode(status) {
    if (status >= 200 && status < 300) {
        return "2XX";
    }
    if (status >= 300 && status < 400) {
        return "3XX";
    }
    if (status >= 400 && status < 500) {
        return "4XX";
    }
    return "5XX";
}
exports.normalizeStatusCode = normalizeStatusCode;
