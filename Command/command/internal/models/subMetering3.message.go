package models

type SubMetering3Message struct {
	Pattern string       `json:"pattern"`
	Data    SubMetering3 `json:"data"`
}
