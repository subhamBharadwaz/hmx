
FROM node:16-alpine

ADD package.json /tmp/package.json

ADD yarn.lock /tmp/yarn.lock


RUN cd /tmp && yarn --pure-lockfile

# RUN rm -rf build

# RUN cd /tmp && yarn install

# ADD ./ /src

# RUN rm -rf src/node_modules && cp -a /tmp/node_modules /src/

ADD ./ /src

RUN cp -a /tmp/node_modules /src/

WORKDIR /src

RUN npm run-script build

## TODO rm before deployment
EXPOSE 5000

CMD ["node", "build/src/index.js"]

