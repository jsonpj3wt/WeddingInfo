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
using WeddingInfo.Domain.Queries.HomeComponents;
using WeddingInfo.Domain.Commands.CreateHomeComponent;
using WeddingInfo.Domain.Commands.UpdateHomeComponent;

namespace WeddingInfo.Api.Controllers
{
	[Route("api/homeComponents")]
	public class HomeComponentsController : Controller
    {
		private readonly IHomeQueries _homeQueries;
        private readonly IMediator _mediator;
		public HomeComponentsController(IHomeQueries homeQueries, IMediator mediator)
        {
            _homeQueries = homeQueries;
            _mediator = mediator;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
			HomeComponentDto result = await _homeQueries.GetById(id);

            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll() {
			IEnumerable<HomeComponentDto> result = await _homeQueries.GetAll();

            return Ok(result);
        }
        
        [HttpPost]
		[ClaimRequirement("Role", "True")]
        public async Task<IActionResult> CreateLocation([FromBody]CreateHomeCommand command) {
            if (command == null) {
                return BadRequest();
            }
			HomeComponentDto result = await _mediator.Send(command);
            return Ok(result);
        }

        [HttpPut]
		[ClaimRequirement("Role", "True")]
        public async Task<IActionResult> UpdateLocation([FromBody]UpdateHomeCommand command)
        {
            if (command == null)
            {
                return BadRequest();
            }
			HomeComponentDto result = await _mediator.Send(command);
            return Ok(result);
        }
    }
}
