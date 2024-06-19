package services

type CommandService interface {
	ReceiveEvents() error
	SendCommands(*string) error
}
