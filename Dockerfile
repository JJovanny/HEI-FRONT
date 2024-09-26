FROM node:18
WORKDIR /home/node/app
USER root
CMD npm i -g yarn
VOLUME ["/home/node/app"]
