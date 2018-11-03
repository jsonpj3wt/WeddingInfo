using System;
using System.Collections.Generic;

namespace WeddingInfo.Domain.Models
{
    public class Location
    {
		public int Id { get; set; }
		public string Name { get; set; }
		public string Address { get; set; }
        public int Order { get; set; }
        public string Website { get; set; }
		public string Description { get; set; }
		public IList<Media> Images { get; set; } = new List<Media>();
		public IList<Media> Videos { get; set; } = new List<Media>();
    }
}
