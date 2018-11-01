using System;
using System.Collections.Generic;
using WeddingInfo.Domain.Commands.UpdateUser;
using WeddingInfo.Domain.DTOs;
using MediatR;

namespace WeddingInfo.Domain.Commands.UpdateBulkUser
{
	public class UpdateBulkUserCommand: IRequest<IEnumerable<UserDto>>
    {
		public IEnumerable<UpdateUserCommand> BulkUpdateUserData { get; set; }
    }
}
