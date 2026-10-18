FROM node:22-alpine AS base

WORKDIR /pantry-mate

FROM base AS deps

COPY package*.json .
COPY apps/api/package.json apps/api/
COPY --parents packages/**/package.json .

RUN npm ci --omit=dev --ignore-scripts

FROM deps AS build

ENV HUSKY=0
RUN npm ci

COPY apps/api apps/api
COPY packages packages

RUN npm run build -w apps/api

FROM base AS prod

COPY --from=deps /pantry-mate/node_modules ./node_modules
COPY --from=build /pantry-mate/apps/api/dist ./apps/api/dist

ENV NODE_ENV=production
USER node

CMD ["node", "apps/api/dist/index.js"]
