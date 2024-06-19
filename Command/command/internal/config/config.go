package config

import (
	"log"

	"github.com/spf13/viper"
)

type Config struct {
	MQTT      MQTTConfig
	Websocket WebsocketConfig
}

type MQTTConfig struct {
	MQTTServer string
	MQTTPort   int
	Topics     []string
}

type WebsocketConfig struct {
	Address string
	Port    string
}

func Load() *Config {
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath(".")
	viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err != nil {
		log.Fatalf("Error reading config file %s", err)
	}

	var cfg Config
	if err := viper.Unmarshal(&cfg); err != nil {
		log.Fatalf("Unable to decode into struct: %v", err)
	}

	return &cfg
}
