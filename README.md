# IOT-project-3

Dataset:
https://data.world/databeats/household-power-consumption

Upuststva za pokretanje:
1. Nakon pullovanja pozicionirati se u IOT-project-3\Sensor\sensor direkotrijum i u terminalu ukucati:docker image build -t sensor:1 .
2. Zatim se pozicionirati u IOT-project-3\Filter\filter i u terminalu ukucati docker image build -t filter:1 .
3. Onda se pozicionirati u IOT-project-3\Dashboard\Dashboard i u termianlu ukucati docker image build -t dashoard:1 .
4. Potrebno je pozicionirati se i u IOT-project-3\Command\command i u terminalu ukucati docker image build -t command:1 .
5. Na posletku potrebno je pozicionirati se i u IOT-project-3\WebPage\webpage i u terminalu ukucati docker image build -t webpage:1 .
6. Nakon toga iz terminala kreirati 8 volume-a:
7. docker volume create influxdb2-config
8. docker volume create influxdb2-data
9. docker volume create mosquitto.conf
10. docker volume create grafana-storage
11. docker volume create kuiper.data
12. docker volume create kuiper.log
13. docker volume create mosquitt.conf
14. docker volume create mqtt_source.yaml
15. Takodje treba kreirati 1 network:
16. docker network create BRIDGE
17. Zatim se pozicionirati u direktorijum IOT-project-3 i u terminalu uneti docker-compose up -d
18. Sada je potrebno otici na link localhost:8086 na kome se nalazi influxdb graficko okruzenje (username:aleksandar10 password:iotPassword10), i u okviru koga treba generisati token za pristup bazi.
19. Nakon toga u direktorijumu IOT-project-3 u terminalu uneti docker-compose down
20. U okvriu istog direktorijuma izmeniti docker-compose.yml, konkretno dodati u sensor service ENV promenljivu INFLUX_API_TOKEN sa vrednoscu novodobijenog tokena, takodje u okviru IOT-project-3\Dashboard\Dashboard izmeniti appsettings.json:
21. U sekciji "Influxdb":{ "Token":  uneti vrednost novodobijenog tokena
22. Takodje sada je potrebno azurarati image Dashboard servisa, iz terminala sa lokacije IOT-project-3\Dashboard\Dashboard:
23. docker image rm dashoard:1
24. docker image build -t dashoard:1 .
25. Nakon cega ponovo u teminral sa lokacije IOT-project-3 uneti: docker-compose up -d
26. Nakon toga je potrebno uneti podatke u bazu (iz istog terminala):
27. docker cp ./Dataset/databeats-household-power-consumption/household_power_consumption.csv influxdb-compose:/var/lib/influxdb2
28. Pa onda:
29. docker exec -ti influxdb-compose bash
30. influx write -b PowerConsumption -f /var/lib/influxdb2/household_power_consumption.csv --header "#constant measurement,power_consum" --header "#datatype double,double,double,double,double,double,double,dateTime"
31. Takodje je potrebno podesiti konfiguraciju eclipse mosquitto-a, u direktorijumu IOT-project-3\Mosquitto otvoriti terminal i unesti:
32. docker cp ./config/mosquitto.conf mosquitto-compose:/mosquitto/config
33. Na kraju ponovo iz terminala u direktorijumu IOT-project-3 stopirati docker compose:
34. docker-compose down
35. I ponovo ga pokrenuti:
36. docker-compose up -d
37. Webpage aplikaciej se nalazi na: http://localhost:3333
38. InfluxDB je na: http://localhost:8086
39. Grafana je na: http://localhost:4545
40. eKuiper manager je na: http://localhost:9082
