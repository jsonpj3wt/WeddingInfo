using System;
namespace WeddingInfo.Domain.DTOs
{
    public class RegistryDto
    {
		public int Id { get; set; }
        public string ImageSrc { get; set; }
        public string Name { get; set; }
        public int Order { get; set; }
        public string Website { get; set; }
    }
}
