package services

import (
	"command/internal/config"
	"flag"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

type WebSocketServiceImpl struct {
	cfg  config.Config
	c    []*websocket.Conn
	addr *string
}

func (w *WebSocketServiceImpl) StartAsync(s *string) error {
	http.HandleFunc("/"+*s, w.acceptConnectionAsync)
	if err := http.ListenAndServe(*w.addr, nil); err != nil {
		log.Print("WS server start failed")
		return err
	}
	return nil
}

func (w *WebSocketServiceImpl) DisconnectAsync() error {
	for _, element := range w.c {
		if err := element.Close(); err == nil {
			return err
		}
	}
	return nil
}

func (w *WebSocketServiceImpl) acceptConnectionAsync(writer http.ResponseWriter, req *http.Request) {
	// var addr = flag.String("addr", w.cfg.Web.Address+":"+w.cfg.Web.Port, "web page address")
	// u := url.URL{Scheme: "ws", Host: *addr, Path: "/events"}

	// c, _, err := websocket.DefaultDialer.Dial(u.String(), nil)

	// if err != nil {
	// 	return err
	// }
	// w.c = c
	// var upgrader= websocket.Upgrader{};
	// upgrader.Upgrade()

	var upgrager = websocket.Upgrader{}
	c, err := upgrager.Upgrade(writer, req, nil)
	w.c = append(w.c, c)

	if err != nil {
		log.Fatal("upgrade:", err)
	}

}

func (w *WebSocketServiceImpl) ReceiveMessageAsync() error {
	for _, element := range w.c {
		_, bytes, err := element.ReadMessage()
		if err != nil {
			return err
		}
		log.Print(string(bytes))
	}
	return nil
}

func (w *WebSocketServiceImpl) SendMessageAsync(s *string) error {
	for _, element := range w.c {
		if err := element.WriteMessage(websocket.TextMessage, []byte(*s)); err == nil {
			return err
		}
	}
	return nil
}

func NewEventService(
	cfg *config.Config,
) WebSocketService {
	return &WebSocketServiceImpl{
		cfg:  *cfg,
		c:    nil,
		addr: flag.String("addr", cfg.Websocket.Address+":"+cfg.Websocket.Port, "server address"),
	}
}
