FROM node:12.15.0
COPY package.json /server/package.json
COPY aspect /server/aspect
WORKDIR /server
# RUN npm cache verify
# RUN npm install -g degit
# RUN npm install -g create-react-app
RUN mkdir public
RUN npm install
ADD . /server
CMD node server.js

