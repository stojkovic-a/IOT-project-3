FROM node:20
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
COPY .env .
ENV INFLUX_API_TOKEN=SuEiYjOF3b0XwQoMV8r1F-lH-TNNIjmfQ472p7SbFBPW_2qmxyMsGSQrluWhDCtINPo-eVHp2jyfEtKB_HeY7g==
ENV INFLUX_URL=http://influxdb2:8086
ENV MEASUREMENT=power_consum
ENV ORGANIZATION=Elfak
ENV BUCKET=PowerConsumption
ENV READ_PERIOD_MS=5000
ENV READ_FROM=2007-01-02T14:54:00Z
ENV READ_TO=2007-06-30T23:59:00Z
RUN npm run build
CMD ["npm", "run", "start:dev"]