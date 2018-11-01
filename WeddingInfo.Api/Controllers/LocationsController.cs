using System.Collections.Generic;
using System.Threading.Tasks;
using WeddingInfo.Domain.Commands.CreateLocation;
using WeddingInfo.Domain.Commands.DeleteLocation;
using WeddingInfo.Domain.Commands.UpdateLocation;
using WeddingInfo.Domain.DTOs;
using WeddingInfo.Domain.Queries.Locations;
using WeddingInfo.Api.Security;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace WeddingInfo.Api.Controllers
{
	[Route("api/locations")]
	public class LocationsController : Controller
    {
		private readonly ILocationQueries _locQueries;
        private readonly IMediator _mediator;
		public LocationsController(ILocationQueries locQueries, IMediator mediator)
        {
            _locQueries = locQueries;
            _mediator = mediator;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
			LocationDto result = await _locQueries.GetById(id);

            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll() {
			IEnumerable<LocationDto> result = await _locQueries.GetAll();

            return Ok(result);
        }
        
        [HttpPost]
		[ClaimRequirement("Role", "True")]
        public async Task<IActionResult> CreateLocation([FromBody]CreateLocationCommand command) {
            if (command == null) {
                return BadRequest();
            }
			LocationDto result = await _mediator.Send(command);
            return Ok(result);
        }

        [HttpPut]
		[ClaimRequirement("Role", "True")]
        public async Task<IActionResult> UpdateLocation([FromBody]UpdateLocationCommand command)
        {
            if (command == null)
            {
                return BadRequest();
            }
			LocationDto result = await _mediator.Send(command);
            return Ok(result);
        }

		[HttpDelete("{id}")]
		[ClaimRequirement("Role", "True")]
        public async Task<IActionResult> Delete(int id)
        {
			DeleteLocationCommand command = new DeleteLocationCommand
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
