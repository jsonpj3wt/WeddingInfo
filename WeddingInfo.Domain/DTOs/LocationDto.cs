using System;
using System.Collections.Generic;

namespace WeddingInfo.Domain.DTOs
{
    public class LocationDto
    {
		public int Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string Website { get; set; }
		public IList<MediaDto> Images { get; set; } = new List<MediaDto>();
        public IList<MediaDto> Videos { get; set; } = new List<MediaDto>();
		public string Description { get; set; }
    }
}
