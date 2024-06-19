package main

import (
	"command/internal/config"
	"command/internal/services"
	"log"
)

var (
	mqttService services.MqttService
	cfg         config.Config
)

func init() {
	cfg = *config.Load()
	mqttService = services.NewMqttService(&cfg)
	if err := mqttService.ConnectAsync(); err != nil {
		log.Fatal(err.Error())
	}

}

func main() {

}
