namespace Dashboard.Services
{
    public interface IDashboardService
    {
        public Task NatsToInfluxDBAsync();
    }
}
