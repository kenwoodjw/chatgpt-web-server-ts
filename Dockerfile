# service
FROM node:lts-alpine


WORKDIR /app

# 将 package.json 和 pnpm-lock.yaml 复制到工作目录
COPY ./package*.json ./
COPY ./pnpm-lock.yaml ./



# 为了安装sqlite3需要安装一些编译工具
RUN npm install pnpm -g
RUN pnpm install
RUN pnpm setup && pnpm i -g @nestjs/cli

COPY ./* /app/
RUN nest build

ADD ./.env /app/dist/.env
# 设置时区
ENV TZ=Asia/Shanghai

EXPOSE 3002

CMD ["pnpm", "run", "start:prod"]
