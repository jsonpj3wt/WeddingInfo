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

namespace WeddingInfo.Domain.Queries.HomeComponents
{
	public class HomeQueries: IHomeQueries
    {
		private readonly IJasonSarahContext _context;
		private readonly IMapper _mapper;

		public HomeQueries(IJasonSarahContext context, IMapper mapper)
        {
			_context = context;
			_mapper = mapper;
        }

		public async Task<IEnumerable<HomeComponentDto>> GetAll()
		{
			return await _context
				.HomeComponents
				.Include(home => home.Sections)
				.ThenInclude(s => s.TopParallax)
				.Include(home => home.Sections)
                .ThenInclude(s => s.BottomParallax)
				.ProjectTo<HomeComponentDto>(_mapper.ConfigurationProvider)
				.ToListAsync();
		}

		public async Task<HomeComponentDto> GetById(int Id)
		{
			HomeComponent homeComponent = await _context
				.HomeComponents
				.Include(home => home.Sections)
				.ThenInclude(s => s.TopParallax)
                .Include(home => home.Sections)
                .ThenInclude(s => s.BottomParallax)
				.FirstOrDefaultAsync(l => l.Id == Id);
			return _mapper.Map<HomeComponent, HomeComponentDto>(homeComponent);
		}

		public async Task<IEnumerable<HomeComponentDto>> GetManyAsync(Expression<Func<HomeComponent, bool>> where)
		{
			return await _context
				.HomeComponents
				.Include(home => home.Sections)
				.ThenInclude(s => s.TopParallax)
                .Include(home => home.Sections)
                .ThenInclude(s => s.BottomParallax)
                .Where(where)
                .ProjectTo<HomeComponentDto>(_mapper.ConfigurationProvider)
                .ToListAsync();
		}
	}
}
