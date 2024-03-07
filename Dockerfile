FROM node:21.6.2-alpine
WORKDIR /opt/app
ADD package.json package.json
RUN npm install -g pnpm
RUN pnpm install
ADD . .
RUN npx prisma generate
RUN pnpm run build
RUN pnpm prune --production
CMD node /opt/app/dist/main.js && npx prisma db push