using Dashboard.DTOs;
using Dashboard.Services;
using Newtonsoft.Json;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<NATSService>();


var app = builder.Build();

var service =app.Services.GetRequiredService<NATSService>();
service.SubscribeToTopic("filter", (sender, args) =>
{
    Console.WriteLine("hi");
    Console.WriteLine(JsonConvert.DeserializeObject<NATSMessage>(Encoding.UTF8.GetString(args.Message.Data)).Data.AvgGlobalActivePower);
    //Console.WriteLine(Encoding.UTF8.GetString(args.Message.Data));
});





app.Run();
