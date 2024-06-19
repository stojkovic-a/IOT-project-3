package services

type WebSocketService interface {
	// acceptConnectionAsync(http.ResponseWriter, *http.Request)
	DisconnectAsync() error
	SendMessageAsync(*string) error
	ReceiveMessageAsync() error
	StartAsync(*string) error
}
