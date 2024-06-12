using Dashboard.DTOs;
using InfluxDB.Client;
using InfluxDB.Client.Api.Domain;
using InfluxDB.Client.Writes;
using Microsoft.AspNetCore.Mvc.Formatters;
using NATS.Client;
using NATS.Client.JetStream;
using System.Globalization;
using System.Reflection;
using System.Runtime.CompilerServices;

namespace Dashboard.Services
{
    public class InfluxDBService : IInfluxDBService
    {
        private readonly IConfiguration _config;
        private readonly InfluxDBClient _client;
        private string organizationId = "";
        public InfluxDBService(IConfiguration config)
        {
            _config = config;
            var token = _config.GetSection("InfluxDB").GetSection("Token").Value;
            var dbUrl = _config.GetSection("InfluxDB").GetSection("Url").Value;
            if (token == null || dbUrl == null)
                throw new Exception("Invalid appsettings");

            _client = new InfluxDBClient(dbUrl.ToString(), token.ToString());
            
            
        }

        private async Task<string> GetOrganizationIdAsync()
        {
            if (string.IsNullOrEmpty(this.organizationId))
            {
                var organizationName = _config.GetSection("InfluxDB").GetSection("Organization").Value;
                if (organizationName == null)
                    throw new Exception("Invalid appsettings");
                var organizationApi = _client.GetOrganizationsApi();
                var organization = await organizationApi.FindOrganizationsAsync(org: organizationName.ToString());

                if (organization == null)
                {
                    throw new Exception("Organization not found");
                }
                this.organizationId = organization.First().Id;
            }
            return this.organizationId;
        }

        public async Task BucketInit(string bucketName)
        {
            if (bucketName == null)
                throw new Exception("Invalid appsettings");

            var bucketApi = _client.GetBucketsApi();
           
            var bucket = await bucketApi.FindBucketByNameAsync(bucketName.ToString(),CancellationToken.None);
            
            if (bucket != null) {
                return;
            }

            string orgId;
            try
            {
                orgId = await GetOrganizationIdAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }


            _ = await bucketApi.CreateBucketAsync(bucketName.ToString(), orgId);
        }

        public void Disconnect()
        {
            _client.Dispose();
        }

        public async Task<string> Read(DateTime dateFrom, DateTime dateTo,string bucketName, string measuremnt)
        {
            string orgId;
            try
            {
                orgId = await GetOrganizationIdAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

            var queryApi = _client.GetQueryApi();

            var flux = $"from(bucket: \"{bucketName}\") " +
                $"|> range(start: {dateFrom.ToString("O", CultureInfo.InvariantCulture)}, stop:{dateTo.ToString("O", CultureInfo.InvariantCulture)})" +
                $"|> filter(fn: (r) => r._measurement == \"{measuremnt}\")" +
                $"|> pivot(rowKey:[\"_time\"], columnKey: [\"_field\"], valueColumn: \"_value\")";
                
            var csv=await queryApi.QueryRawAsync(flux,org:orgId);

            return csv;
           
        }

        public async Task Write<T>(T o,string bucketName)
        {

            string orgId;
            try
            {
                orgId = await GetOrganizationIdAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

            using var writeApi = _client.GetWriteApi();
            writeApi.WriteMeasurement(o, WritePrecision.Ms, bucketName, orgId);
        }

        //private Dictionary<string, object> PocoToDictionary(object source)
        //{
        //    if (source == null)
        //    {
        //        throw new ArgumentNullException(nameof(source));
        //    }

        //    var dictionary = new Dictionary<string, object>();
        //    foreach (PropertyInfo property in source.GetType().GetProperties(BindingFlags.Public | BindingFlags.Instance))
        //    {
        //        if (property.CanRead)
        //        {
        //            var temp=property.GetValue(source,null);
        //            if (temp == null)
        //                temp = -1;
        //            dictionary[property.Name] = temp;
        //        }
        //    }

        //    return dictionary;
        //}

        public async Task Write<T>(T o, string bucketName, string measurement)
        {
            if (o == null)
                return;

            string orgId;
            try
            {
                orgId = await GetOrganizationIdAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

            using var writeApi = _client.GetWriteApi();
            var point = PointData.Measurement(measurement).Timestamp(DateTime.Now, WritePrecision.Ms);
            foreach (PropertyInfo property in o.GetType().GetProperties(BindingFlags.Public | BindingFlags.Instance))
            {
                if (property.CanRead)
                {
                    if (property.PropertyType == typeof(DateTime))
                    {
                        var temp = property.GetValue(o, null);
                        if (temp == null)
                            throw new ArgumentNullException(property.Name);
                        point=point.Timestamp((DateTime)temp, WritePrecision.Ms);
                    }
                    else
                    {
                        point=point.Field(property.Name, property.GetValue(o, null));
                    }
                }
            }

            writeApi.WritePoint(point, bucketName, orgId);
        }
    }
}
