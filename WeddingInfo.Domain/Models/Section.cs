using System;
namespace WeddingInfo.Domain.Models
{
    public class Section
    {
		public int Id { get; set; }
		public string Header { get; set; }
		public string Text { get; set; }
		public Parallax TopParallax { get; set; }
		public Parallax BottomParallax { get; set; }
    }
}
