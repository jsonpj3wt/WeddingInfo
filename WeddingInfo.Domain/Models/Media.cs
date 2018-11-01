using System;
using WeddingInfo.Domain.Enumerations;

namespace WeddingInfo.Domain.Models
{
    public class Media
    {
		public int Id { get; set; }
		public string Path { get; set; }
		public MediaType MediaType { get; set; }
    }
}
