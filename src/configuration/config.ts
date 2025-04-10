// import {join} from 'node:path';

import * as process from "node:process";

export const config = {
    web: {
        port: process.env.LOGGER_PORT || 8080,
        address: process.env.LOGGER_HOST || '0.0.0.0',
        // https: {
        //     key: process.env.CSP_LOGGER_KEY || `${join(import.meta.dirname, '../../certs/csp-logger.key')}`,
        //     cert: process.env.CSP_LOGGER_CERT || `${join(import.meta.dirname, '../../certs/csp-logger.crt')}`
        // }
    }
}
