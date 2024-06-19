package models

type VoltageMessage struct {
	Pattern string  `json:"pattern"`
	Data    Voltage `json:"data"`
}
