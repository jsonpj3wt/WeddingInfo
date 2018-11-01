using System;
using System.Collections.Generic;

namespace WeddingInfo.Domain.DTOs
{
    public class HomeComponentDto
    {
		public int Id { get; set; }

        public string Title { get; set; }

        public IList<SectionDto> Sections { get; set; }
    }
}
