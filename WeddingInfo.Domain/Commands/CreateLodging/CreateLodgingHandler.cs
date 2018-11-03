using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using WeddingInfo.Domain.Context;
using WeddingInfo.Domain.DTOs;
using WeddingInfo.Domain.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace WeddingInfo.Domain.Commands.CreateLodging
{
	public class CreateLodgingHandler : IRequestHandler<CreateLodgingCommand, LodgingDto>
    {
        private readonly IJasonSarahContext _context;
        private readonly IMapper _mapper;

		public CreateLodgingHandler(IJasonSarahContext context)
        {
            _context = context;

            var config = new MapperConfiguration(cfg =>
            {
				cfg.CreateMap<CreateLodgingCommand, Lodging>();
				cfg.CreateMap<Lodging, LodgingDto>();
            });

            _mapper = config.CreateMapper();
        }

		public async Task<LodgingDto> Handle(CreateLodgingCommand command, CancellationToken cancellationToken)
        {
			Lodging newLodging = _mapper.Map<CreateLodgingCommand, Lodging>(command);
            int count = await _context.Lodgings.CountAsync();
            newLodging.Order = count + 1;
            await _context.Lodgings.AddAsync(newLodging);
			_context.Commit();
			return _mapper.Map<Lodging, LodgingDto>(newLodging);
        }
    }
}

