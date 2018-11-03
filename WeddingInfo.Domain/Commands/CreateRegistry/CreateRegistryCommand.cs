using WeddingInfo.Domain.DTOs;
using MediatR;

namespace WeddingInfo.Domain.Commands.CreateRegistry
{
	public class CreateRegistryCommand: IRequest<RegistryDto>
    {
		public int Id { get; set; }
        public string ImageSrc { get; set; }
        public string Name { get; set; }
        public int Order { get; set; }
        public string Website { get; set; }
    }
}
