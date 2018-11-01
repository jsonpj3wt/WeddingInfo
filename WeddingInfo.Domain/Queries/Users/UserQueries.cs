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

namespace WeddingInfo.Domain.Queries.Users
{
	public class UserQueries: IUserQueries
    {
        private readonly IJasonSarahContext _context;
        private readonly IMapper _mapper;

		public UserQueries(IJasonSarahContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

		public async Task<IEnumerable<UserDto>> GetAll()
        {
            return await _context
				.Users
				.ProjectTo<UserDto>(_mapper.ConfigurationProvider)
                .ToListAsync();
        }

		public async Task<UserDto> GetById(int Id)
        {
			User theUser = await _context.Users.FindAsync(Id);
			return _mapper.Map<User, UserDto>(theUser);
        }

		public async Task<IEnumerable<UserDto>> GetManyAsync(Expression<Func<User, bool>> where)
        {
            return await _context
				.Users
                .Where(where)
				.ProjectTo<UserDto>(_mapper.ConfigurationProvider)
                .ToListAsync();
        }
    }
}
