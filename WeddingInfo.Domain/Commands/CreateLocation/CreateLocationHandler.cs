using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using WeddingInfo.Domain.Context;
using WeddingInfo.Domain.DTOs;
using WeddingInfo.Domain.Models;
using MediatR;

namespace WeddingInfo.Domain.Commands.CreateLocation
{
	public class CreateLocationHandler : IRequestHandler<CreateLocationCommand, LocationDto>
    {
        private readonly IJasonSarahContext _context;
        private readonly IMapper _mapper;

		public CreateLocationHandler(IJasonSarahContext context)
        {
            _context = context;

            var config = new MapperConfiguration(cfg =>
            {
				cfg.CreateMap<CreateLocationCommand, Location>();
				cfg.CreateMap<Location, LocationDto>();
            });

            _mapper = config.CreateMapper();
        }

		public async Task<LocationDto> Handle(CreateLocationCommand command, CancellationToken cancellationToken)
        {
			Location newLocation = _mapper.Map<CreateLocationCommand, Location>(command);

			await _context.Locations.AddAsync(newLocation);
			_context.Commit();
			return _mapper.Map<Location, LocationDto>(newLocation);
        }
    }
}

