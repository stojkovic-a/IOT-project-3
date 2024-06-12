using Dashboard.DTOs;
using NATS.Client;
using Newtonsoft.Json;
using System.Text;

namespace Dashboard.Services
{
    public class DashboardService(IInfluxDBService influx, INATSService nats, IConfiguration configuration) : IDashboardService
    {
        private readonly IInfluxDBService _influx = influx;
        private readonly INATSService _nats = nats;
        private readonly IConfiguration _configuration = configuration;

        public async Task NatsToInfluxDBAsync()
        {
            var topic = _configuration.GetSection("Topic").Value;
            var bucketName = _configuration.GetSection("InfluxDB").GetSection("Bucket").Value;
            var measurement= _configuration.GetSection("InfluxDB").GetSection("Measurement").Value;

            if (bucketName == null||topic==null||measurement==null)
            {
                throw new Exception("appsettings error");
            }

            await _influx.BucketInit(bucketName.ToString());

            async void e(object? sender, MsgHandlerEventArgs args)
            {
                var temp = JsonConvert.DeserializeObject<NATSMessage>(Encoding.UTF8.GetString(args.Message.Data));
                if (temp == null)
                    return;
                await _influx.Write<Window>(temp.Data, bucketName.ToString(), measurement.ToString());
                //await _influx.Write<Window>(temp.Data, bucketName.ToString());

            }

            _nats.SubscribeToTopic(topic.ToString(), e);

        }
    }
}
