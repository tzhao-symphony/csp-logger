FROM node:23-alpine
ADD ./dist /apps/

EXPOSE 8080/tcp

ENTRYPOINT [ "node", "/apps/index.cjs" ]
