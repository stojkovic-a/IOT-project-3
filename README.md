# IOT-project-3

Dataset:
https://data.world/databeats/household-power-consumption

Upuststva za pokretanje:
1. Nakon pullovanja pozicionirati se u IOT-project-3 i uneti sledece instrukcije u terminal:
2. docker image build -t sensor:1 .\Sensor\sensor
3. docker image build -t filter:1 .\Filter\filter
4. docker image build -t dashoard:1 .\Dashboard\Dashboard
5. docker image build -t command:1 .\Command\command
6. docker image build -t webpage:1 .\WebPage\webpage 
7. docker volume create influxdb2-config
8. docker volume create influxdb2-data
9. docker volume create mosquitto.conf
10. docker volume create grafana-storage
11. docker volume create kuiper.data
12. docker volume create kuiper.log
13. docker volume create mosquitt.conf
14. docker volume create mqtt_source.yaml
15. docker network create BRIDGE
16. docker-compose up -d
17. Sada je potrebno otici na link localhost:8086 na kome se nalazi influxdb graficko okruzenje (username:aleksandar10 password:iotPassword10), i u okviru koga treba generisati token za pristup bazi.
18. Nakon toga u direktorijumu IOT-project-3 u terminalu uneti: docker-compose down
19. U okvriu istog direktorijuma izmeniti docker-compose.yml, konkretno dodati u sensor service ENV promenljivu INFLUX_API_TOKEN sa vrednoscu novodobijenog tokena
20. Takodje u okviru IOT-project-3\Dashboard\Dashboard izmeniti appsettings.json:
21. U sekciji "Influxdb":{ "Token":  uneti vrednost novodobijenog tokena
22. Takodje sada je potrebno azurirati image Dashboard servisa, iz terminala sa lokacije IOT-project-3\Dashboard\Dashboard:
23. docker image rm dashoard:1
24. docker image build -t dashoard:1 .
25. Nakon cega ponovo u teminral sa lokacije IOT-project-3 uneti: docker-compose up -d
26. Nakon toga je potrebno uneti podatke u bazu, iskopirati konfiguraciju za mosquitto, grafanu i eKuiper(iz istog terminala):
27. docker cp ./Dataset/databeats-household-power-consumption/household_power_consumption.csv influxdb-compose:/var/lib/influxdb2
28. docker exec -ti influxdb-compose bash
29. influx write -b PowerConsumption -f /var/lib/influxdb2/household_power_consumption.csv --header "#constant measurement,power_consum" --header "#datatype double,double,double,double,double,double,double,dateTime"
30. exit
31. docker cp ./Mosquitto/config/mosquitto.conf mosquitto-compose:/mosquitto/config
32. docker cp ./Grafana/storage grafana-compose:/var/lib/grafana
33. docker cp ./eKuiper/Config ekuiper:/kuiper/data
34. Na kraju ponovo iz terminala u direktorijumu IOT-project-3 stopirati docker compose:
35. docker-compose down
36. I ponovo ga pokrenuti:
37. docker-compose up -d
38. Webpage aplikaciej se nalazi na: http://localhost:3333
39. InfluxDB je na: http://localhost:8086
40. Grafana je na: http://localhost:4545
41. eKuiper manager je na: http://localhost:9082
