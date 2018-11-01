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

namespace WeddingInfo.Domain.Queries.Lodgings
{
	public class LodgingQueries: ILodgingQueries
    {
        private readonly IJasonSarahContext _context;
        private readonly IMapper _mapper;

		public LodgingQueries(IJasonSarahContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

		public async Task<IEnumerable<LodgingDto>> GetAll()
        {
            return await _context
				.Lodgings
				.ProjectTo<LodgingDto>(_mapper.ConfigurationProvider)
                .ToListAsync();
        }

		public async Task<LodgingDto> GetById(int Id)
        {
			Lodging theLodging = await _context
				.Lodgings
				.FindAsync(Id);
			return _mapper.Map<Lodging, LodgingDto>(theLodging);
        }

		public async Task<IEnumerable<LodgingDto>> GetManyAsync(Expression<Func<Lodging, bool>> where)
        {
            return await _context
				.Lodgings
                .Where(where)
				.ProjectTo<LodgingDto>(_mapper.ConfigurationProvider)
                .ToListAsync();
        }
    }
}
