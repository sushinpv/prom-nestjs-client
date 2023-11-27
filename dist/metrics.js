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
Object.defineProperty(exports, "__esModule", { value: true });
exports.restErrorResponseHistogram = exports.responseLengthGenerator = exports.requestLengthGenerator = exports.requestDurationGenerator = exports.requestCountGenerator = void 0;
const Prometheus = __importStar(require("prom-client"));
function requestCountGenerator(labelNames, prefix = "") {
    return new Prometheus.Counter({
        name: `${prefix}http_requests_total`,
        help: "Counter for total requests received",
        labelNames,
    });
}
exports.requestCountGenerator = requestCountGenerator;
function requestDurationGenerator(labelNames, buckets, prefix = "") {
    return new Prometheus.Histogram({
        name: `${prefix}http_request_duration_seconds`,
        help: "Duration of HTTP requests in seconds",
        labelNames,
        buckets,
    });
}
exports.requestDurationGenerator = requestDurationGenerator;
function requestLengthGenerator(labelNames, buckets, prefix = "") {
    return new Prometheus.Histogram({
        name: `${prefix}http_request_length_bytes`,
        help: "Content-Length of HTTP request",
        labelNames,
        buckets,
    });
}
exports.requestLengthGenerator = requestLengthGenerator;
function responseLengthGenerator(labelNames, buckets, prefix = "") {
    return new Prometheus.Histogram({
        name: `${prefix}http_response_length_bytes`,
        help: "Content-Length of HTTP response",
        labelNames,
        buckets,
    });
}
exports.responseLengthGenerator = responseLengthGenerator;
const restErrorResponseHistogram = new Prometheus.Histogram({
    name: "nodejs_error_responses",
    help: "NodeJs Application Errors",
    buckets: [10],
    labelNames: ["controller", "error"],
});
exports.restErrorResponseHistogram = restErrorResponseHistogram;
