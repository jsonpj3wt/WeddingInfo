using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using WeddingInfo.Domain.Context;
using WeddingInfo.Domain.DTOs;
using WeddingInfo.Domain.Models;
using MediatR;

namespace WeddingInfo.Domain.Commands.DeleteUser
{
	public class DeleteUserHandler : IRequestHandler<DeleteUserCommand, bool>
    {
        private readonly IJasonSarahContext _context;
        private readonly IMapper _mapper;

		public DeleteUserHandler(IJasonSarahContext context)
        {
            _context = context;

            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<Event, EventDto>();
            });

            _mapper = config.CreateMapper();
        }

        public async Task<bool> Handle(DeleteUserCommand command, CancellationToken cancellationToken)
        {
            if (command.Id <= 0)
            {
                return false;
            }
			User theUser = await _context.Users.FindAsync(command.Id);
			if (theUser == null) {
				return false;
			}
			_context.Users.Remove(theUser);
            _context.Commit();
            return true;
        }
    }
}
