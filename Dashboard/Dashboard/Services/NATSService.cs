using NATS.Client;

namespace Dashboard.Services
{
    public class NATSService : INATSService
    {
        private IConfiguration _config;
        private ConnectionFactory _cf;
        private IConnection _connection;
        private Dictionary<string, IAsyncSubscription> _subs;
        public NATSService(IConfiguration config)
        {
            _config = config;
            _cf = new ConnectionFactory();
            _connection = _cf.CreateConnection(_config.GetSection("NATSServer").Value, true);
            _subs=new Dictionary<string, IAsyncSubscription>();
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
            if (_subs.ContainsKey(topic))
            {
                _subs[topic].Unsubscribe();
            }
        }
    }
}
