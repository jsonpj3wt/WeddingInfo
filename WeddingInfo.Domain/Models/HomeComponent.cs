using System;
using System.Collections.Generic;

namespace WeddingInfo.Domain.Models
{
    public class HomeComponent
    {
		public int Id { get; set; }

		public string Title { get; set; }

		public IList<Section> Sections { get; set; } = new List<Section>();
    }
}
