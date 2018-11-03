using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using WeddingInfo.Domain.Context;
using WeddingInfo.Domain.DTOs;
using WeddingInfo.Domain.Models;
using MediatR;

namespace WeddingInfo.Domain.Commands.CreateHomeComponent
{
	public class CreateHomeHandler: IRequestHandler<CreateHomeCommand, HomeComponentDto>
    {
		private readonly IJasonSarahContext _context;
		private readonly IMapper _mapper;

		public CreateHomeHandler(IJasonSarahContext context) {
			_context = context;

			var config = new MapperConfiguration(cfg =>
			{
				cfg.CreateMap<CreateHomeCommand, HomeComponent>();
				cfg.CreateMap<HomeComponent, HomeComponentDto>();
			});

			_mapper = config.CreateMapper();
		}

		public async Task<HomeComponentDto> Handle(CreateHomeCommand request, CancellationToken cancellationToken) {
			HomeComponent homeComponent = _mapper.Map<CreateHomeCommand, HomeComponent>(request);

			await _context.HomeComponents.AddAsync(homeComponent);
			_context.Commit();
			return _mapper.Map<HomeComponent, HomeComponentDto>(homeComponent);
		}
    }
}
