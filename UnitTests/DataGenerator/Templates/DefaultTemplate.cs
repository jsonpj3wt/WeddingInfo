using System;
using DataGenerator.Interfaces;

namespace DataGenerator.Templates
{
	public class DefaultTemplate: ITemplate
    {
		public int EventCount { get; set; } = 5;
		public int LocationCount { get; set; } = 5;
		public int LodgingCount { get; set; } = 5;
		public int MediaCount { get; set; } = 5;
		public int UserCount { get; set; } = 5;
    }
}
