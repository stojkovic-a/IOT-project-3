package models

type GlobalIntensityMessage struct {
	Pattern string            `json:"pattern"`
	Data    GlobalIntensity `json:"data"`
}
