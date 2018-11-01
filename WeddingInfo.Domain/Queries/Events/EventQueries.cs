using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using WeddingInfo.Domain.Context;
using WeddingInfo.Domain.DTOs;
using WeddingInfo.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace WeddingInfo.Domain.Queries.Events
{
	public class EventQueries: IEventQueries
    {
		private readonly IJasonSarahContext _context;
		private readonly IMapper _mapper;

		public EventQueries(IJasonSarahContext context, IMapper mapper)
        {
			_context = context;
			_mapper = mapper;
        }

		public async Task<IEnumerable<EventDto>> GetAll()
		{
			return await _context
				.Events
				.Include(l => l.Images)
                .Include(l => l.Videos)
				.Include(l => l.Guests)
				.ProjectTo<EventDto>(_mapper.ConfigurationProvider)
				.ToListAsync();
		}

		public async Task<EventDto> GetById(int Id)
		{
			Event theEvent = await _context
				.Events
				.Include(l => l.Images)
                .Include(l => l.Videos)
				.Include(l => l.Guests)
				.FirstOrDefaultAsync(l => l.Id == Id);
			return _mapper.Map<Event, EventDto>(theEvent);
		}

		public async Task<IEnumerable<EventDto>> GetManyAsync(Expression<Func<Event, bool>> where)
		{
			return await _context
                .Events
				.Include(l => l.Images)
                .Include(l => l.Videos)
				.Include(l => l.Guests)
                .Where(where)
                .ProjectTo<EventDto>(_mapper.ConfigurationProvider)
                .ToListAsync();
		}
	}
}
