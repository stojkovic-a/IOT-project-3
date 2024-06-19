package services

import (
	"command/internal/config"
	"fmt"

	mqtt "github.com/eclipse/paho.mqtt.golang"
)

type MqttServiceImpl struct {
	cfg    config.Config
	client mqtt.Client
}

func NewMqttService(cfg *config.Config) MqttService {
	var broker = cfg.MQTT.MQTTServer
	var port = cfg.MQTT.MQTTPort
	opts := mqtt.NewClientOptions()
	opts.AddBroker(fmt.Sprintf("mqtt://%s:%d", broker, port))
	c := mqtt.NewClient(opts)
	return &MqttServiceImpl{
		cfg:    *cfg,
		client: c,
	}
}

func (m *MqttServiceImpl) ConnectAsync() error {
	if token := m.client.Connect(); token.Wait() && token.Error() != nil {
		return token.Error()
	}
	return nil
}

func (m *MqttServiceImpl) DisconnectAsync() error {
	m.client.Disconnect(100)
	return nil
}

func (m *MqttServiceImpl) SubscribeToTopicAsync(topic *string, handler mqtt.MessageHandler) error {
	token := m.client.Subscribe(*topic, 2, handler)
	token.Wait()
	if token.Error() != nil {
		return token.Error()
	}
	return nil
}

func (m *MqttServiceImpl) UnsubscribeFromTopicAsync(topic *string) error {
	token := m.client.Unsubscribe(*topic)
	token.Wait()
	if token.Error() != nil {
		return token.Error()
	}
	return nil
}

func (m *MqttServiceImpl) PublishMessageAsync(topic *string, data *string) error {
	token := m.client.Publish(*topic, 2, false, data)
	token.Wait()
	if token.Error() != nil {
		return token.Error()
	}
	return nil
}
