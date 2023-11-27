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
exports.Prometheus = exports.metricsLogError = exports.parseError = void 0;
const express_1 = __importDefault(require("express"));
const prom_client_1 = __importDefault(require("prom-client"));
exports.Prometheus = prom_client_1.default;
const response_time_1 = __importDefault(require("response-time"));
const metrics_1 = require("./metrics");
const normalizers_1 = require("./normalizers");
const defaultOptions = {
    metricsPath: "/metrics",
    app: process.env.SERVICE_NAME || "service-name",
    metricsApp: null,
    authenticate: null,
    collectDefaultMetrics: true,
    collectGCMetrics: false,
    requestDurationBuckets: prom_client_1.default.exponentialBuckets(0.05, 1.75, 8),
    requestLengthBuckets: [],
    responseLengthBuckets: [],
    extraMasks: [],
    customLabels: [],
    transformLabels: null,
    normalizeStatus: true,
    defaultLabels: { serviceName: process.env.SERVICE_NAME || "service-name" },
};
const parseError = (error) => {
    let parsedError = null;
    try {
        parsedError = JSON.stringify(error);
        if (parsedError === "{}")
            parsedError = error.toString();
    }
    catch (err) {
        parsedError = error;
    }
    return parsedError;
};
exports.parseError = parseError;
const metricsLogError = (controller, error) => {
    let parsedError = (0, exports.parseError)(error);
    if (parsedError && !(error === null || error === void 0 ? void 0 : error.status))
        metrics_1.restErrorResponseHistogram.observe({ controller, error: parsedError }, 10);
};
exports.metricsLogError = metricsLogError;
exports.default = (userOptions = {}) => {
    const options = Object.assign(Object.assign({}, defaultOptions), userOptions);
    const originalLabels = ["route", "method", "status"];
    options.customLabels = new Set([...originalLabels, ...options.customLabels]);
    options.customLabels = [...options.customLabels];
    const { metricsPath, metricsApp, normalizeStatus } = options;
    const app = (0, express_1.default)();
    app.disable("x-powered-by");
    const requestDuration = (0, metrics_1.requestDurationGenerator)(options.customLabels, options.requestDurationBuckets, options.prefix);
    const requestCount = (0, metrics_1.requestCountGenerator)(options.customLabels, options.prefix);
    const requestLength = (0, metrics_1.requestLengthGenerator)(options.customLabels, options.requestLengthBuckets, options.prefix);
    const responseLength = (0, metrics_1.responseLengthGenerator)(options.customLabels, options.responseLengthBuckets, options.prefix);
    const redMiddleware = (0, response_time_1.default)((req, res, time) => {
        const { originalUrl, method } = req;
        const route = (0, normalizers_1.normalizePath)(originalUrl, options.extraMasks);
        if (route !== metricsPath) {
            const status = normalizeStatus ? (0, normalizers_1.normalizeStatusCode)(res.statusCode) : res.statusCode.toString();
            const labels = { route, method, status };
            if (typeof options.transformLabels === "function") {
                options.transformLabels(labels, req, res);
            }
            requestCount.inc(labels);
            requestDuration.observe(labels, time / 1000);
            if (options.requestLengthBuckets.length) {
                const reqLength = req.get("Content-Length");
                if (reqLength) {
                    requestLength.observe(labels, Number(reqLength));
                }
            }
            if (options.responseLengthBuckets.length) {
                const resLength = res.get("Content-Length");
                if (resLength) {
                    responseLength.observe(labels, Number(resLength));
                }
            }
        }
    });
    if (options.collectDefaultMetrics) {
        prom_client_1.default.collectDefaultMetrics({
            prefix: options.prefix,
        });
    }
    if (options.collectGCMetrics) {
        try {
            const gcStats = require("prometheus-gc-stats");
            const startGcStats = gcStats(prom_client_1.default.register, {
                prefix: options.prefix,
            });
            startGcStats();
        }
        catch (err) {
        }
    }
    app.use(redMiddleware);
    const routeApp = metricsApp || app;
    routeApp.get(metricsPath, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        if (typeof options.authenticate === "function") {
            let result = null;
            try {
                result = yield options.authenticate(req);
            }
            catch (err) {
            }
            if (!result) {
                return next();
            }
        }
        res.set("Content-Type", prom_client_1.default.register.contentType);
        return res.end(yield prom_client_1.default.register.metrics());
    }));
    return app;
};
