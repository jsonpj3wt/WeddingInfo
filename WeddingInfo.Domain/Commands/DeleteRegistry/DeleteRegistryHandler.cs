using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using WeddingInfo.Domain.Context;
using WeddingInfo.Domain.DTOs;
using WeddingInfo.Domain.Models;
using MediatR;

namespace WeddingInfo.Domain.Commands.DeleteRegistry
{
	public class DeleteRegistryHandler : IRequestHandler<DeleteRegistryCommand, bool>
    {
        private readonly IJasonSarahContext _context;
        private readonly IMapper _mapper;

		public DeleteRegistryHandler(IJasonSarahContext context)
        {
            _context = context;

            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<Event, EventDto>();
            });

            _mapper = config.CreateMapper();
        }

		public async Task<bool> Handle(DeleteRegistryCommand command, CancellationToken cancellationToken)
        {
			if (command.Id <= 0) {
				return false;
			}
			Registry theRegistry = await _context.Registries.FindAsync(command.Id);
			if (theRegistry == null)
            {
                return false;
            }
			_context.Registries.Remove(theRegistry);
            _context.Commit();
			return true;
        }
    }
}
