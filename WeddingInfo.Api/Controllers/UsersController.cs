using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using WeddingInfo.Domain.Commands.CreateUser;
using WeddingInfo.Domain.Commands.DeleteUser;
using WeddingInfo.Domain.Commands.UpdateBulkUser;
using WeddingInfo.Domain.Commands.UpdateUser;
using WeddingInfo.Domain.DTOs;
using WeddingInfo.Domain.Queries.Users;
using WeddingInfo.Api.Security;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace WeddingInfo.Api.Controllers
{
	[Route("api/users")]
	public class UsersController : Controller
    {
		private readonly IUserQueries _userQueries;
		private readonly IMediator _mediator;
		public UsersController(IUserQueries userQueries, IMediator mediator)
        {
			_userQueries = userQueries;
			_mediator = mediator;
        }

		[HttpGet("{id}")]
		public async Task<IActionResult> Get(int id)
        {
			UserDto result = await _userQueries.GetById(id);

			return Ok(result);
        }

		[HttpGet]
		public async Task<IActionResult> GetAll() {
			IEnumerable<UserDto> result = await _userQueries.GetAll();

			return Ok(result);
		}

		[HttpGet("attending")]
		public async Task<IActionResult> GetAttending() {
			IEnumerable<UserDto> result = await _userQueries.GetManyAsync(
				u => u.IsAttending
			);

			return Ok(result);
		}

		[HttpGet("name/{firstName}/{lastName}")]
        public async Task<IActionResult> GetByName(string firstName, string lastName)
        {
			IEnumerable<UserDto> result = await _userQueries.GetManyAsync(
				u => (string.IsNullOrEmpty(firstName)
					  || firstName.ToLower() == u.FirstName.ToLower()
					 )
				&& (string.IsNullOrEmpty(lastName)
					|| lastName.ToLower() == u.LastName.ToLower()
				   )
			);

            return Ok(result);
        }
        
		[HttpPost]
		public async Task<IActionResult> CreateUser([FromBody]CreateUserCommand command) {
			if (command == null) {
				return BadRequest();
			}

			UserDto result = await _mediator.Send(command);
			return Ok(result);
		}
        
		[HttpPut("bulk")]
        public async Task<IActionResult> BulkUpdate([FromBody]UpdateBulkUserCommand command)
        {
            if (command == null)
            {
                return BadRequest();
            }
            IEnumerable<UserDto> result = await _mediator.Send(command);
            return Ok(result);
        }

		[HttpPut]
        public async Task<IActionResult> UpdateUser([FromBody]UpdateUserCommand command)
        {
            if (command == null)
            {
                return BadRequest();
            }
            UserDto result = await _mediator.Send(command);
            return Ok(result);
        }
        
		[HttpDelete("{id}")]
		[ClaimRequirement("Role", "True")]
        public async Task<IActionResult> Delete(int id)
        {
            DeleteUserCommand command = new DeleteUserCommand
            {
                Id = id
            };

            if (command == null)
            {
                return BadRequest();
            }
            bool result = await _mediator.Send(command);
            return Ok(result);
        }
    }
}
