using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using WeddingInfo.Domain.Commands.UpdateUser;
using WeddingInfo.Domain.Context;
using WeddingInfo.Domain.DTOs;
using WeddingInfo.Domain.Models;
using MediatR;

namespace WeddingInfo.Domain.Commands.UpdateBulkUser
{
	public class UpdateBulkUserHandler : IRequestHandler<UpdateBulkUserCommand, IEnumerable<UserDto>>
	{
		private readonly IJasonSarahContext _context;
		private readonly IMapper _mapper;
		public UpdateBulkUserHandler(IJasonSarahContext context)
		{
			_context = context;

			var config = new MapperConfiguration(cfg =>
			{
				cfg.CreateMap<UpdateUserCommand, User>();
				cfg.CreateMap<User, UserDto>();
			});
			_mapper = config.CreateMapper();
		}

		public async Task<IEnumerable<UserDto>> Handle(UpdateBulkUserCommand command, CancellationToken cancellationToken)
		{
			IList<User> users = new List<User>();
            foreach (var item in command.BulkUpdateUserData)
            {
				User theUser = await _context.Users.FindAsync(item.Id);
				theUser = _mapper.Map<UpdateUserCommand, User>(item, theUser);
				users.Add(theUser);
            }


			_context.Users.UpdateRange(users);
			_context.Commit();
			return _mapper.Map<IList<User>, IEnumerable<UserDto>>(users);
		}
	}
}
