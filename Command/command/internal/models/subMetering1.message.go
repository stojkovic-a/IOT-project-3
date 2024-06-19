package models

type SubMetering1Message struct {
	Pattern string       `json:"pattern"`
	Data    SubMetering1 `json:"data"`
}
