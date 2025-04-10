import fastify from 'fastify'
import {ReportsType, ReportType} from "./src/schemas/csp-violations.js";
import cors from '@fastify/cors';
import {config} from "./src/configuration/config.js";
import {CspStore} from "./src/store.js";

console.log("Configuration:\n", JSON.stringify(config, undefined, 4))

const configuration = {
    logger: true
};

const cspCache : any[] = [];

const cspStore = new CspStore();

const server = fastify(configuration)
server.addContentTypeParser('application/reports+json', {parseAs: 'string'}, server.getDefaultJsonParser('ignore', 'ignore'));

server.register(cors, {origin: true})

server.post<{ Body: ReportType[]}>('/csp',
    async (request, reply) => {
    const report = request.body;
    console.log(JSON.stringify(report, undefined, 4));
    cspCache.concat(...report.map(r => r.body));
    reply.code(204).send();
});

server.post<{ Body: ReportsType}>('/csp/log',
    async (request, reply) => {
        const report = request.body;
        cspStore.addReport(report);
        reply.code(204).send();
    });


server.get('/showCsp', async (req, resp) => {
    resp.send(cspCache);
})

server.get('/csp/show/revived', async (req, resp) => {
    resp.send(cspStore.getRevivedReport());
})

server.get('/csp/show/lightweight', async(req, res) => {
    res.send(cspStore.getLightWeightReports());
})

server.get('/csp/health', async (request, reply) => {
    reply.code(200).send({status: 'ok'})
});

server.get('/csp/reset', async (request, reply) => {
    cspStore.clear();
    reply.code(204).send()
});

server.get('/csp/version', async (request, reply) => {
    reply.code(200).send({version: '1.0.0'});
})

server.listen({ host: config.web.address, port: +config.web.port }, (err: Error | null, address: string): void => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
})
