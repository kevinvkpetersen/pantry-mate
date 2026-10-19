# syntax=docker/dockerfile:1

FROM node:24.22-alpine AS base

WORKDIR /pantry-mate

########################################

FROM base AS package-files

COPY package*.json .
COPY apps/api/package.json apps/api/
COPY --parents packages/**/package.json .

########################################

FROM package-files AS prod-deps

RUN npm ci --omit=dev --ignore-scripts

########################################

FROM package-files AS build-deps

ENV HUSKY=0
RUN npm ci

########################################

FROM build-deps AS build

COPY apps/api apps/api
COPY packages packages

RUN npm run build -w apps/api

########################################

FROM build-deps AS dev

CMD ["npx", "tsx", "watch", "--inspect=0.0.0.0:9229", "apps/api/src/index.ts"]

########################################

FROM base AS prod

COPY --from=prod-deps /pantry-mate/node_modules ./node_modules
COPY --from=build /pantry-mate/apps/api/dist ./apps/api/dist

ENV NODE_ENV=production
USER node

CMD ["node", "apps/api/dist/index.js"]
