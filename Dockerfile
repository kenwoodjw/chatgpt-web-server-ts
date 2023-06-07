# service
FROM node:lts-alpine

# 为了安装sqlite3需要安装一些编译工具
RUN npm install pnpm -g

WORKDIR /app

COPY ./ /app

# 安装sqlite3
# RUN pnpm install sqlite3
RUN pnpm install --production && rm -rf /root/.npm /root/.pnpm-store /usr/local/share/.cache /tmp/*

ADD ./env /app/dist/.env
# 设置时区
ENV TZ=Asia/Shanghai

EXPOSE 3002

CMD ["pnpm", "run", "start:prod"]
