using System;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using WeddingInfo.Domain.Context;
using WeddingInfo.Domain.DTOs;
using WeddingInfo.Domain.Models;
using MediatR;

namespace WeddingInfo.Domain.Commands.UpdateUser
{
	public class UpdateUserHandler : IRequestHandler<UpdateUserCommand, UserDto>
    {
        private readonly IJasonSarahContext _context;
        private readonly IMapper _mapper;
		public UpdateUserHandler(IJasonSarahContext context)
        {
            _context = context;

            var config = new MapperConfiguration(cfg =>
            {
				cfg.CreateMap<UpdateUserCommand, User>();
				cfg.CreateMap<User, UserDto>();
            });
			_mapper = config.CreateMapper();
        }

		public async Task<UserDto> Handle(UpdateUserCommand command, CancellationToken cancellationToken)
        {
			if (!string.IsNullOrEmpty(command.Password))
            {
				Regex regex = new Regex(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,15}$");
                if (!regex.IsMatch(command.Password))
                {
                    return null;
                }
                byte[] data = System.Text.Encoding.ASCII.GetBytes(command.Password);
                using (var sha512 = System.Security.Cryptography.SHA512.Create())
                {
                    data = sha512.ComputeHash(data);
                    string hash = System.Text.Encoding.ASCII.GetString(data);
                    command.Password = hash;
                }
            }


			User theUser = await _context.Users.FindAsync(command.Id);
			theUser = _mapper.Map<UpdateUserCommand, User>(command, theUser);

			_context.Users.Update(theUser);
			_context.Commit();
			return _mapper.Map<User, UserDto>(theUser);
        }
    }
}

