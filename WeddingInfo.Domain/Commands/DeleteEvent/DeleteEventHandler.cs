using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using WeddingInfo.Domain.Context;
using WeddingInfo.Domain.DTOs;
using WeddingInfo.Domain.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace WeddingInfo.Domain.Commands.DeleteEvent
{
	public class DeleteEventHandler : IRequestHandler<DeleteEventCommand, bool>
    {
        private readonly IJasonSarahContext _context;
        private readonly IMapper _mapper;

		public DeleteEventHandler(IJasonSarahContext context)
        {
            _context = context;

            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<Event, EventDto>();
            });

            _mapper = config.CreateMapper();
        }

		public async Task<bool> Handle(DeleteEventCommand command, CancellationToken cancellationToken)
        {
			if (command.Id <= 0) {
				return false;
			}
			Event theEvent = await _context
                .Events
                .Include(e => e.Images)
                .Include(e => e.Videos)
                .FirstOrDefaultAsync(e => e.Id == command.Id);
			if (theEvent == null)
            {
                return false;
            }
			_context.Events.Remove(theEvent);
            _context.Commit();
			return true;
        }
    }
}
