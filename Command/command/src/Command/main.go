package main

import (
	"command/internal/config"
	"command/internal/services"
	"log"
	"sync"
)

var (
	mqttService services.MqttService
	cfg         config.Config
	cmdService  services.CommandService
	wsService   services.WebSocketService
)

func init() {
	cfg = *config.Load()
	mqttService = services.NewMqttService(&cfg)
	if err := mqttService.ConnectAsync(); err != nil {
		log.Fatal(err.Error())
	}
	wsService = services.NewWebScoketService(&cfg)
	cmdService = services.NewCommandService(&cfg, &mqttService, &wsService)

}

func main() {
	defer mqttService.DisconnectAsync()
	defer wsService.DisconnectAsync()

	temp := "event"

	var wg sync.WaitGroup
	wg.Add(1)

	go func() {
		defer wg.Done()
		if err := wsService.StartAsync(&temp); err != nil {
			log.Fatal(err)
		}
	}()

	if err := cmdService.ReceiveEvents(); err != nil {
		log.Fatal(err)
	}

	log.Print("waiting for Wait Group to finish")
	wg.Wait()

}
