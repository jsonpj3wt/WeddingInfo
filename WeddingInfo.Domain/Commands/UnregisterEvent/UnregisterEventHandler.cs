using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WeddingInfo.Domain.Context;
using WeddingInfo.Domain.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace WeddingInfo.Domain.Commands.UnregisterEvent
{
	public class UnregisterEventHandler: IRequestHandler<UnregisterEventCommand, bool>
    {
		private readonly IJasonSarahContext _context;

		public UnregisterEventHandler(IJasonSarahContext context)
        {
            _context = context;
        }

		public async Task<bool> Handle(UnregisterEventCommand request, CancellationToken cancellationToken)
		{
			Event evnt = await _context
				.Events
				.Include(evt => evt.Guests)
				.FirstOrDefaultAsync(evt => evt.Id == request.EventId, cancellationToken);
			if (evnt == null || !evnt.Guests.Any(g => g.Id == request.UserId)) {
				return false;
			}
			User user = await _context.Users.FindAsync(request.UserId);

			evnt.Guests.Remove(user);

			_context.Commit();

			return true;

		}
	}
}
