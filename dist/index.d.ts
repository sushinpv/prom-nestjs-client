import Prometheus from "prom-client";
export declare const parseError: (error: any) => any;
export declare const metricsLogError: (controller: string, error: Error & {
    status?: boolean;
}) => void;
export { Prometheus };
declare const _default: (userOptions?: {}) => import("express-serve-static-core").Express;
export default _default;
