package models

type GlobalActivePowerMessage struct {
	Pattern string            `json:"pattern"`
	Data    GlobalActivePower `json:"data"`
}
