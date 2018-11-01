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

namespace WeddingInfo.Domain.Queries.Locations
{
	public class LocationQueries: ILocationQueries
    {
        private readonly IJasonSarahContext _context;
        private readonly IMapper _mapper;

		public LocationQueries(IJasonSarahContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

		public async Task<IEnumerable<LocationDto>> GetAll()
        {
            return await _context
				.Locations
				.Include(l => l.Images)
				.Include(l => l.Videos)
				.ProjectTo<LocationDto>(_mapper.ConfigurationProvider)
                .ToListAsync();
        }

		public async Task<LocationDto> GetById(int Id)
        {
			Location theLocation = await _context
				.Locations
				.Include(l => l.Images)
                .Include(l => l.Videos)
				.FirstOrDefaultAsync(l => l.Id == Id);
			return _mapper.Map<Location, LocationDto>(theLocation);
        }

		public async Task<IEnumerable<LocationDto>> GetManyAsync(Expression<Func<Location, bool>> where)
        {
            return await _context
				.Locations
				.Include(l => l.Images)
                .Include(l => l.Videos)
                .Where(where)
				.ProjectTo<LocationDto>(_mapper.ConfigurationProvider)
                .ToListAsync();
        }
    }
}
