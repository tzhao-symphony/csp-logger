import {cspDirectives} from "@sym-csp-logger/common";
import {blockedUrlNonUrlValues} from "@sym-csp-logger/common";
const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';


const policies = ["default-src 'self'; media-src 'self' *.symphony.com:* *.startpage.local:* blob:; connect-src https: wss: blob:; object-src blob: 'self'; font-src *.symphony.com:* https://fonts.gstatic.com *.startpage.local:*; style-src https://fonts.googleapis.com 'unsafe-inline' 'self' *.symphony.com:* *.startpage.local:*; script-src blob: 'unsafe-eval' 'self' *.symphony.com:* symphony.com 'nonce-dhgvU8PnMblkyssmABtuFGZBbj42taVtl7BstwMSGyc=' *.startpage.local:*; img-src *:* data: blob: *.startpage.local:*; frame-src *:* blob:; frame-ancestors *:*;"]
const products = ['login','admin-console','client2','embed','open'];
const origins: string[] = []
for (let i = 0; i < 1000; i++) {
    origins.push(`test-corporate.${i}.symphony.com`);
}


function generateString(length: number) {
    let result = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}
// @ts-ignore
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

let callStackSize = 0;
const maxParallelCalls = 500;
const queue: Array<() => Promise<any>> = []
let calls = 0;

async function queueNext(cb: () => Promise<any>) {
    if (callStackSize < maxParallelCalls) {
        callStackSize++;
        calls++;
        cb().then(() => {
            processNext()
        })
    } else {
        queue.push(cb);
    }
}
const startTime = Date.now();
async function processNext() {
    if (queue.length) {
        calls++;
        const cb = queue.pop();
        if (cb) {
        return cb().then(() => {
            processNext()
        })}
    } else {
        console.log(`Finished ${calls}: ${Date.now() - startTime}`);
    }
}

let maxCalls = 2000000;
let index=0;
        for (let origin of origins) {
            if (index > maxCalls) break;
                for (let blockedUrl of [...blockedUrlNonUrlValues, ...['blob:', 'media:']]) {

            for (let policy of policies) {
                for (let p of products) {
                    for (let directive of cspDirectives.slice(0,5)) {
                        index++;

                        queueNext(() => fetch('https://local-dev.symphony.com:8080/csp_custom', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                reports: [{
                                    origin: origin,
                                    path: `/apps/${p}/default`,
                                    effectiveDirective: directive,
                                    blockedURL: blockedUrl,
                                    disposition: 'report'
                                }], policy
                            })
                        }).then(res => {
                            // console.log(res.status)
                        }))
                }
            }
        }
    }
}
