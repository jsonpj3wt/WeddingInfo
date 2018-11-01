using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using WeddingInfo.Domain.Context;
using WeddingInfo.Domain.DTOs;
using WeddingInfo.Domain.Models;

namespace WeddingInfo.Domain.Queries.Registries
{
	public class RegistryQueries: IRegistryQueries
    {
		private readonly IJasonSarahContext _context;
        private readonly IMapper _mapper;

		public RegistryQueries(IJasonSarahContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<RegistryDto>> GetAll()
        {
            return await _context
				.Registries
				.ProjectTo<RegistryDto>(_mapper.ConfigurationProvider)
                .ToListAsync();
        }

		public async Task<RegistryDto> GetById(int Id)
        {
			Registry theRegistry = await _context
				.Registries.FindAsync(Id);
			return _mapper.Map<Registry, RegistryDto>(theRegistry);
        }

		public async Task<IEnumerable<RegistryDto>> GetManyAsync(Expression<Func<Registry, bool>> where)
        {
            return await _context
				.Registries
                .Where(where)
				.ProjectTo<RegistryDto>(_mapper.ConfigurationProvider)
                .ToListAsync();
        }
	}
}
