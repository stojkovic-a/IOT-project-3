using NATS.Client;

namespace Dashboard.Services
{
    public class NATSService : INATSService
    {
        private readonly IConfiguration _config;
        private readonly ConnectionFactory _cf;
        private readonly IConnection _connection;
        private readonly Dictionary<string, IAsyncSubscription> _subs;
        public NATSService(IConfiguration config)
        {
            _config = config;
            _cf = new ConnectionFactory();
            _connection = _cf.CreateConnection(_config.GetSection("NATSServer").Value, true);
            _subs=[];
        }

        public void Disconnect()
        {
            _connection.Drain();
            _connection.Close();
            _connection.Dispose();
        }

        public void SendMessage(string topic, byte[] data)
        {
            _connection.Publish(topic, data);
        }

        public void SubscribeToTopic(string topic, EventHandler<MsgHandlerEventArgs> h)
        {
            IAsyncSubscription subscription = _connection.SubscribeAsync(topic, h);
            _subs[topic] = subscription;
        }

        public void UnsubscribeFromTopic(string topic)
        {
            if (_subs.TryGetValue(topic, out IAsyncSubscription? value))
            {
                value.Unsubscribe();
            }
        }
    }
}
