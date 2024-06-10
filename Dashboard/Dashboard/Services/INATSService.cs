using NATS.Client;

namespace Dashboard.Services
{
    public interface INATSService
    {
        public void SubscribeToTopic(string topic, EventHandler<MsgHandlerEventArgs> h);

        public void UnsubscribeFromTopic(string topic);

        public void SendMessage(string topic, byte[] data);

        public void Disconnect();
    }
}
