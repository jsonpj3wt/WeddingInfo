using System.Collections.Generic;
using WeddingInfo.Domain.DTOs;
using MediatR;

namespace WeddingInfo.Domain.Commands.CreateLocation
{
	public class CreateLocationCommand: IRequest<LocationDto>
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
