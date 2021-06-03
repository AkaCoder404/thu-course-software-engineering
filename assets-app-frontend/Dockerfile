FROM node:12.18.3

RUN npm config set registry https://registry.npm.taobao.org

ENV HOME=/opt/app
ENV SASS_BINARY_SITE=https://npm.taobao.org/mirrors/node-sass/

WORKDIR $HOME

COPY package.json $HOME
COPY package-lock.json $HOME
RUN npm config set registry https://registry.npm.taobao.org
RUN npm install

COPY . $HOME
RUN npm run build

ENV SERVER_PORT 80
EXPOSE 80

# CMD serve -s build -l 80
CMD npm run start
