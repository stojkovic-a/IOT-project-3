namespace Dashboard.DTOs
{
    public class Window
    {
        public DateTime WindowsTimestamp { get; set; }
        public double AvgGlobalActivePower { get; set; }
        public double AvgGlobalReactivePower { get; set; }
        public double AvgGlobalIntensity { get; set; }
        public double AvgVoltage { get; set; }
        public double AvgSubMetering_1 { get;set; }
        public double AvgSubMetering_2 { get; set; }
        public double AvgSubMetering_3 { get; set; }


    }
}
