using System;
using WeddingInfo.Domain.Enumerations;

namespace WeddingInfo.Domain.DTOs
{
    public class MediaDto
    {
		public int Id { get; set; }
        public string Path { get; set; }
		public MediaType MediaType { get; set; }
    }
}
