using Dashboard.DTOs;
using Dashboard.Services;
using InfluxDB.Client.Api.Service;
using Newtonsoft.Json;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<INATSService,NATSService>();
builder.Services.AddSingleton<IInfluxDBService,InfluxDBService>();
builder.Services.AddSingleton<IDashboardService, DashboardService>();


var app = builder.Build();

var natsToInflux = app.Services.GetRequiredService<IDashboardService>();
await natsToInflux.NatsToInfluxDBAsync();





app.Run();
