namespace Dashboard.Services
{
    public interface IInfluxDBService
    {
        public Task BucketInit(string bucketName);
        public void Disconnect();
        public Task Write<T>(T o,string bucketName);
        public Task Write<T>(T o, string bucketName, string measurement);
        public Task<string> Read(DateTime dateFrom, DateTime dateTo, string bucketName, string measuremnt);

    }
}
