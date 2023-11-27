import * as Prometheus from "prom-client";
declare function requestCountGenerator(labelNames: string[], prefix?: string): Prometheus.Counter<string>;
declare function requestDurationGenerator(labelNames: string[], buckets: number[], prefix?: string): Prometheus.Histogram<string>;
declare function requestLengthGenerator(labelNames: string[], buckets: number[], prefix?: string): Prometheus.Histogram<string>;
declare function responseLengthGenerator(labelNames: string[], buckets: number[], prefix?: string): Prometheus.Histogram<string>;
declare const restErrorResponseHistogram: Prometheus.Histogram<"controller" | "error">;
export { requestCountGenerator, requestDurationGenerator, requestLengthGenerator, responseLengthGenerator, restErrorResponseHistogram };
