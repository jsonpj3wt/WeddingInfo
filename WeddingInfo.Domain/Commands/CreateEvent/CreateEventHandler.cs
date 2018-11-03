using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using WeddingInfo.Domain.Context;
using WeddingInfo.Domain.DTOs;
using WeddingInfo.Domain.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace WeddingInfo.Domain.Commands.CreateEvent
{
	public class CreateEventHandler: IRequestHandler<CreateEventCommand, EventDto>
    {
		private readonly IJasonSarahContext _context;
		private readonly IMapper _mapper;

		public CreateEventHandler(IJasonSarahContext context) {
			_context = context;

			var config = new MapperConfiguration(cfg =>
			{
				cfg.CreateMap<CreateEventCommand, Event>();
				cfg.CreateMap<Event, EventDto>();
			});

			_mapper = config.CreateMapper();
		}

		public async Task<EventDto> Handle(CreateEventCommand request, CancellationToken cancellationToken) {
			Event newEvent = _mapper.Map<CreateEventCommand, Event>(request);
            int count = await _context.Events.CountAsync();
            newEvent.Order = count + 1;
			await _context.Events.AddAsync(newEvent);
			_context.Commit();
			return _mapper.Map<Event, EventDto>(newEvent);
		}
    }
}
