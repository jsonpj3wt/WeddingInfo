using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using WeddingInfo.Domain.Context;
using WeddingInfo.Domain.DTOs;
using WeddingInfo.Domain.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace WeddingInfo.Domain.Commands.DeleteLocation
{
	public class DeleteLocationHandler : IRequestHandler<DeleteLocationCommand, bool>
    {
        private readonly IJasonSarahContext _context;

		public DeleteLocationHandler(IJasonSarahContext context)
        {
            _context = context;
        }

        public async Task<bool> Handle(DeleteLocationCommand command, CancellationToken cancellationToken)
        {
            if (command.Id <= 0)
            {
                return false;
            }
            Location theLocation = await _context
                .Locations
                .Include(l => l.Images)
                .Include(l => l.Videos)
                .FirstOrDefaultAsync(l => l.Id ==command.Id);

			if (theLocation == null)
            {
                return false;
            }
			_context.Locations.Remove(theLocation);
            _context.Commit();
            return true;
        }
    }
}
