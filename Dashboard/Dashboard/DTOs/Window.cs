using InfluxDB.Client.Core;

namespace Dashboard.DTOs
{
    [Measurement("power_consum")]
    public class Window
    {
        [Column(IsTimestamp = true)]
        public DateTime WindowsTimestamp { get; set; }

        [Column("AvgGlobalActivePower")]
        public double AvgGlobalActivePower { get; set; }

        [Column("AvgGlobalReactivePower")]
        public double AvgGlobalReactivePower { get; set; }

        [Column("AvgGlobalIntensity")]
        public double AvgGlobalIntensity { get; set; }

        [Column("AvgVoltage")]
        public double AvgVoltage { get; set; }

        [Column("AvgSubMetering_1")]
        public double AvgSubMetering_1 { get;set; }

        [Column("AvgSubMetering_2")]
        public double AvgSubMetering_2 { get; set; }

        [Column("AvgSubMetering_3")]
        public double AvgSubMetering_3 { get; set; }


    }
}
