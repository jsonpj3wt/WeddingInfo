using System.Collections.Generic;
using System.Threading.Tasks;
using WeddingInfo.Domain.DTOs;
using WeddingInfo.Domain.Queries.Lodgings;
using WeddingInfo.Api.Security;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using WeddingInfo.Domain.Commands.CreateLodging;
using WeddingInfo.Domain.Commands.UpdateLodging;
using WeddingInfo.Domain.Commands.DeleteLodging;

namespace WeddingInfo.Api.Controllers
{
	[Route("api/lodgings")]
	public class LodgingsController : Controller
    {
		private readonly ILodgingQueries _lodgingQueries;
        private readonly IMediator _mediator;
		public LodgingsController(ILodgingQueries lodgingQueries, IMediator mediator)
        {
            _lodgingQueries = lodgingQueries;
            _mediator = mediator;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
			LodgingDto result = await _lodgingQueries.GetById(id);

            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll() {
			IEnumerable<LodgingDto> result = await _lodgingQueries.GetAll();

            return Ok(result);
        }
        
        [HttpPost]
		[ClaimRequirement("Role", "True")]
        public async Task<IActionResult> CreateLodging([FromBody]CreateLodgingCommand command) {
            if (command == null) {
                return BadRequest();
            }
			LodgingDto result = await _mediator.Send(command);
            return Ok(result);
        }

        [HttpPut]
		[ClaimRequirement("Role", "True")]
		public async Task<IActionResult> UpdateLodging([FromBody]UpdateLodgingCommand command)
        {
            if (command == null)
            {
                return BadRequest();
            }
			LodgingDto result = await _mediator.Send(command);
            return Ok(result);
        }

		[HttpDelete("{id}")]
		[ClaimRequirement("Role", "True")]
        public async Task<IActionResult> Delete(int id)
        {
			DeleteLodgingCommand command = new DeleteLodgingCommand
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
