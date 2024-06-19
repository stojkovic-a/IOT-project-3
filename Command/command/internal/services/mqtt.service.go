package services

import mqtt "github.com/eclipse/paho.mqtt.golang"

type MqttService interface {
	ConnectAsync() error
	DisconnectAsync() error
	SubscribeToTopicAsync(*string, mqtt.MessageHandler) error
	UnsubscribeFromTopicAsync(*string) error
	PublishMessageAsync(*string, *string) error
}
