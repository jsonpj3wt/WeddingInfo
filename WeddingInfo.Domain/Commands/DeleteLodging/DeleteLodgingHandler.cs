using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using WeddingInfo.Domain.Context;
using WeddingInfo.Domain.DTOs;
using WeddingInfo.Domain.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace WeddingInfo.Domain.Commands.DeleteLodging
{
	public class DeleteLodgingHandler : IRequestHandler<DeleteLodgingCommand, bool>
    {
        private readonly IJasonSarahContext _context;

		public DeleteLodgingHandler(IJasonSarahContext context)
        {
            _context = context;
        }

		public async Task<bool> Handle(DeleteLodgingCommand command, CancellationToken cancellationToken)
        {
            if (command.Id <= 0)
            {
                return false;
            }
			Lodging theLodging = await _context
                .Lodgings
                .Include(l => l.Images)
                .Include(l => l.Videos)
                .FirstOrDefaultAsync(l => l.Id == command.Id);

			if (theLodging == null)
            {
                return false;
            }
			_context.Lodgings.Remove(theLodging);
            _context.Commit();
            return true;
        }
    }
}
