ARG NODE_VERSION=20.10
ARG YARN_VERSION=3.6.1
ARG NUXT_PUBLIC_ODOO_BASE_URL="http://odoo-tupunto:8069/"
ARG NUXT_PUBLIC_ODOO_BASE_IMAGE_URL="http://localhost:8069/"
ARG NUXT_PUBLIC_MIDDLEWARE_URL="http://localhost:3000/"
ARG NUXT_PUBLIC_MIDDLEWARE_PORT=8443
ARG REDIS_URL="redis://redis:6379"
ARG NUXT_ALGOLIA_API_KEY="change_api_key"
ARG NUXT_ALGOLIA_APPLICATION_ID="change_application_id"
ARG PORT=3000

FROM node:${NODE_VERSION}-slim AS base

ARG NUXT_ALGOLIA_API_KEY
ARG NUXT_ALGOLIA_APPLICATION_ID
ARG NUXT_PUBLIC_ODOO_BASE_URL
ARG NUXT_PUBLIC_ODOO_BASE_IMAGE_URL
ARG NUXT_PUBLIC_MIDDLEWARE_URL
ARG NUXT_PUBLIC_MIDDLEWARE_PORT
ARG REDIS_URL


ENV NODE_ENV=production
ENV NUXT_PUBLIC_ODOO_BASE_URL=${NUXT_PUBLIC_ODOO_BASE_URL}
ENV NUXT_PUBLIC_ODOO_BASE_IMAGE_URL=${NUXT_PUBLIC_ODOO_BASE_IMAGE_URL}
ENV NUXT_PUBLIC_MIDDLEWARE_URL=${NUXT_PUBLIC_MIDDLEWARE_URL}
ENV NUXT_PUBLIC_MIDDLEWARE_PORT=${NUXT_PUBLIC_MIDDLEWARE_PORT}
ENV REDIS_URL=${REDIS_URL}
ENV NUXT_ALGOLIA_API_KEY=${NUXT_ALGOLIA_API_KEY}
ENV NUXT_ALGOLIA_APPLICATION_ID=${NUXT_ALGOLIA_APPLICATION_ID}
ENV NUXT_TELEMETRY_DISABLED=1

RUN yarn set version ${YARN_VERSION}
WORKDIR /src

# Build
FROM base AS build

COPY . ./
RUN yarn add -W nuxt \
    && yarn \
    && yarn build

# Run
FROM base
ARG NUXT_PUBLIC_ODOO_BASE_URL: "http://odoo-tupunto:8069/"
ARG NUXT_PUBLIC_ODOO_BASE_IMAGE_URL: "http://localhost:8069/"

ENV PORT=$PORT
ENV NODE_ENV=production
ENV NUXT_ALGOLIA_API_KEY=${NUXT_ALGOLIA_API_KEY}
ENV NUXT_ALGOLIA_APPLICATION_ID=${NUXT_ALGOLIA_APPLICATION_ID}
ENV NUXT_TELEMETRY_DISABLED=1

COPY --from=build /src/.output ./

# Expose both ports
EXPOSE $PORT

# Specify the command to run your app
CMD [ "node", "/src/server/index.mjs" ]