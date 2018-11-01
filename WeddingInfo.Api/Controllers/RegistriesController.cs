using System.Collections.Generic;
using System.Threading.Tasks;
using WeddingInfo.Domain.DTOs;
using WeddingInfo.Api.Security;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using WeddingInfo.Domain.Queries.Registries;
using WeddingInfo.Domain.Commands.CreateRegistry;
using WeddingInfo.Domain.Commands.UpdateRegistry;
using WeddingInfo.Domain.Commands.DeleteRegistry;

namespace WeddingInfo.Api.Controllers
{
	[Route("api/registries")]
	public class RegistriesController : Controller
    {
		private readonly IRegistryQueries _registryQueries;
        private readonly IMediator _mediator;
		public RegistriesController(IRegistryQueries registryQueries, IMediator mediator)
        {
            _registryQueries = registryQueries;
            _mediator = mediator;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
			RegistryDto result = await _registryQueries.GetById(id);

            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll() {
			IEnumerable<RegistryDto> result = await _registryQueries.GetAll();

            return Ok(result);
        }
        
        [HttpPost]
		[ClaimRequirement("Role", "True")]
        public async Task<IActionResult> CreateLocation([FromBody]CreateRegistryCommand command) {
            if (command == null) {
                return BadRequest();
            }
			RegistryDto result = await _mediator.Send(command);
            return Ok(result);
        }

        [HttpPut]
		[ClaimRequirement("Role", "True")]
        public async Task<IActionResult> UpdateLocation([FromBody]UpdateRegistryCommand command)
        {
            if (command == null)
            {
                return BadRequest();
            }
			RegistryDto result = await _mediator.Send(command);
            return Ok(result);
        }

		[HttpDelete("{id}")]
		[ClaimRequirement("Role", "True")]
        public async Task<IActionResult> Delete(int id)
        {
			DeleteRegistryCommand command = new DeleteRegistryCommand
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
