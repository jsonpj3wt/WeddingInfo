using System.Collections.Generic;
using WeddingInfo.Domain.DTOs;
using MediatR;

namespace WeddingInfo.Domain.Commands.CreateHomeComponent
{
	public class CreateHomeCommand: IRequest<HomeComponentDto>
    {
		public int Id { get; set; }

        public string Title { get; set; }

        public IList<SectionDto> Sections { get; set; }
    }
}
