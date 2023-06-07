# service
FROM node:lts-alpine

# 为了安装sqlite3需要安装一些编译工具
RUN npm install pnpm -g
RUN npm i -g @nestjs/cli

WORKDIR /app

COPY ./* /app

RUN pnpm install && rm -rf /root/.npm /root/.pnpm-store /usr/local/share/.cache /tmp/*
RUN nset build

ADD ./.env /app/dist/.env
# 设置时区
ENV TZ=Asia/Shanghai

EXPOSE 3002

CMD ["pnpm", "run", "start"]
