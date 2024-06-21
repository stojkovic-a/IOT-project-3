package services

import (
	"command/internal/config"
	"command/internal/models"
	"encoding/json"
	"log"
	"strconv"

	mqtt "github.com/eclipse/paho.mqtt.golang"
)

type CommandServiceImpl struct {
	cfg         config.Config
	mqttService MqttService
	wsService   WebSocketService
	// handlesMap  map[string]mqtt.MessageHandler
}

func (c *CommandServiceImpl) ReceiveEvents() error {
	c.mqttService.ConnectAsync()
	for _, topic := range c.cfg.MQTT.Topics {
		if err := c.mqttService.SubscribeToTopicAsync(&topic, c.handleEvents(&topic)); err != nil {
			return err
		}
	}
	return nil
}

// func (c *CommandServiceImpl) handleEvents(topic *string) mqtt.MessageHandler {
// 	return c.handlesMap[*topic]
// }

func (c *CommandServiceImpl) handleEvents(topic *string) mqtt.MessageHandler {
	var data models.Event
	var f mqtt.MessageHandler = func(client mqtt.Client, m mqtt.Message) {
		// log.Print(string(m.Payload()) + " " + *topic)
		err := json.Unmarshal(m.Payload(), &data)
		if err != nil {
			log.Fatalf("error at unmarshaling %s", err.Error())
		}
		temp := *topic + strconv.FormatFloat(float64(data.Value), 'f', -1, 64)
		c.SendCommands(&temp)
	}
	return f
}

func (c *CommandServiceImpl) SendCommands(s *string) error {
	return c.wsService.SendMessageAsync(s)
}

// func NewCommandService(
// 	cfg *config.Config,
// 	mqttS *MqttService,
// 	ws *WebSocketService,
// ) CommandService {
// 	var csi CommandServiceImpl
// 	csi.cfg = *cfg
// 	csi.mqttService = *mqttS
// 	csi.wsService = *ws

// 	var dataV models.Voltage
// 	csi.handlesMap["ekuiperAnalytics:voltage"] = func(c mqtt.Client, m mqtt.Message) {
// 		err := json.Unmarshal(m.Payload(), &dataV)
// 		if err != nil {
// 			log.Fatalf("error at unmarshaling")
// 		}
// 		temp := "voltage" + dataV.Voltage
// 		csi.SendCommands(&temp)
// 	}

// 	var dataGAP models.GlobalActivePower
// 	csi.handlesMap["ekuiperAnalytics:globalActivePower"] = func(c mqtt.Client, m mqtt.Message) {
// 		err := json.Unmarshal(m.Payload(), &dataGAP)
// 		if err != nil {
// 			log.Fatalf("error at unmarshaling")
// 		}
// 		temp := "globalActivePower" + dataGAP.GlobalActivePower
// 		csi.SendCommands(&temp)
// 	}

// 	var dataGRP models.GlobalReactivePower
// 	csi.handlesMap["ekuiperAnalytics:globalReactivePower"] = func(c mqtt.Client, m mqtt.Message) {
// 		err := json.Unmarshal(m.Payload(), &dataGRP)
// 		if err != nil {
// 			log.Fatalf("error at unmarshaling")
// 		}
// 		temp := "globalReactivePower" + dataGRP.GlobalReactivePower
// 		csi.SendCommands(&temp)
// 	}

// 	var dataGI models.GlobalIntensity
// 	csi.handlesMap["ekuiperAnalytics:globalIntensity"] = func(c mqtt.Client, m mqtt.Message) {
// 		err := json.Unmarshal(m.Payload(), &dataGI)
// 		if err != nil {
// 			log.Fatalf("error at unmarshaling")
// 		}
// 		temp := "globalIntensity" + dataGI.GlobalIntensity
// 		csi.SendCommands(&temp)
// 	}

// 	var dataS1 models.SubMetering1
// 	csi.handlesMap["ekuiperAnalytics:subMetering1"] = func(c mqtt.Client, m mqtt.Message) {
// 		err := json.Unmarshal(m.Payload(), &dataS1)
// 		if err != nil {
// 			log.Fatalf("error at unmarshaling")
// 		}
// 		temp := "subMetering1" + dataS1.SubMetering1
// 		csi.SendCommands(&temp)
// 	}

// 	var dataS2 models.SubMetering2
// 	csi.handlesMap["ekuiperAnalytics:subMetering2"] = func(c mqtt.Client, m mqtt.Message) {
// 		err := json.Unmarshal(m.Payload(), &dataS2)
// 		if err != nil {
// 			log.Fatalf("error at unmarshaling")
// 		}
// 		temp := "subMetering2" + dataS2.SubMetering2
// 		csi.SendCommands(&temp)
// 	}

// 	var dataS3 models.SubMetering3
// 	csi.handlesMap["ekuiperAnalytics:subMetering3"] = func(c mqtt.Client, m mqtt.Message) {
// 		err := json.Unmarshal(m.Payload(), &dataS3)
// 		if err != nil {
// 			log.Fatalf("error at unmarshaling")
// 		}
// 		temp := "subMetering3" + dataS3.SubMetering3
// 		csi.SendCommands(&temp)
// 	}
// 	return &csi
// }

func NewCommandService(
	cfg *config.Config,
	mqttS *MqttService,
	ws *WebSocketService,
) CommandService {
	return &CommandServiceImpl{
		cfg:         *cfg,
		mqttService: *mqttS,
		wsService:   *ws,
	}
}
