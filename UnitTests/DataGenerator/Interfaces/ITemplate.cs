using System;
namespace DataGenerator.Interfaces
{
    public interface ITemplate
    {
		int EventCount { get; set; }
		int LocationCount { get; set; }
		int LodgingCount { get; set; }
		int MediaCount { get; set; }
		int UserCount { get; set; }
    }
}
