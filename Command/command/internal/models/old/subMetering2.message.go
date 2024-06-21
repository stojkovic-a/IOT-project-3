package models

type SubMetering2Message struct {
	Pattern string       `json:"pattern"`
	Data    SubMetering2 `json:"data"`
}
