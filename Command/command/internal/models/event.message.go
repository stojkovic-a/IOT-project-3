package models

type EventMessage struct {
	Pattern string `json:"pattern"`
	Data    Event  `json:"data"`
}
