ARG NODE_VERSION=18


# Prepare the builder image
FROM node:${NODE_VERSION} AS builder
ENV NPM_CONFIG_UPDATE_NOTIFIER=false NPM_CONFIG_FUND=false
RUN apt-get update && apt-get install -y openjdk-17-jdk && apt-get clean
WORKDIR /app

# Build using the entrypoint
COPY ./ ./
RUN ./entrypoint.py build metal --install

# Prune the dev dependencies
RUN cd ./backend && npm prune --omit=dev


# Build the final image
FROM node:${NODE_VERSION} AS final
ENV NPM_CONFIG_UPDATE_NOTIFIER=false NPM_CONFIG_FUND=false


ARG PEK_CLIENT_PATH=/app/frontend
ENV PEK_CLIENT_PATH=$PEK_CLIENT_PATH
COPY --from=builder /app/frontend/build $PEK_CLIENT_PATH

COPY --from=builder /app/backend /app/backend

WORKDIR /app/backend
CMD [ "npm", "run", "start:prod" ]
