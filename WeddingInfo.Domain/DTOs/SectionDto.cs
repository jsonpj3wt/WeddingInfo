using System;
namespace WeddingInfo.Domain.DTOs
{
	public class SectionDto
	{
		public int Id { get; set; }
		public string Header { get; set; }
		public string Text { get; set; }
		public ParallaxDto TopParallax { get; set; }
		public ParallaxDto BottomParallax { get; set; }
		public bool IsParallax
		{
			get
			{
				return TopParallax != null || BottomParallax != null;
			}
		}
	}
}