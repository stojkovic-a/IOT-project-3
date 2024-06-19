package models

type GlobalReactivePowerMessage struct {
	Pattern string            `json:"pattern"`
	Data    GlobalReactivePower `json:"data"`
}
