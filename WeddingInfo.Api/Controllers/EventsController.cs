using System.Collections.Generic;
using System.Threading.Tasks;
using WeddingInfo.Domain.Commands.CreateEvent;
using WeddingInfo.Domain.Commands.DeleteEvent;
using WeddingInfo.Domain.Commands.RegisterEvent;
using WeddingInfo.Domain.Commands.UnregisterEvent;
using WeddingInfo.Domain.Commands.UpdateEvent;
using WeddingInfo.Domain.DTOs;
using WeddingInfo.Domain.Enumerations;
using WeddingInfo.Domain.Queries.Events;
using WeddingInfo.Api.Security;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace WeddingInfo.Api.Controllers
{
	[Route("api/events")]
	public class EventsController : Controller
    {
		private readonly IEventQueries _eventQueries;
        private readonly IMediator _mediator;
		public EventsController(IEventQueries eventQueries, IMediator mediator)
        {
            _eventQueries = eventQueries;
            _mediator = mediator;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
			EventDto result = await _eventQueries.GetById(id);

            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll() {
			IEnumerable<EventDto> result = await _eventQueries.GetAll();
            
            return Ok(result);
        }

		[HttpGet("difficulty/{difficulty}")]
		public async Task<IActionResult> GetByDifficulty(EventDifficulty difficulty) {
			IEnumerable<EventDto> result = await _eventQueries.GetManyAsync(
				evnt => evnt.EventDifficulty == difficulty
            );

            return Ok(result);
        }

		[HttpGet("wedding")]
		public async Task<IActionResult> GetIsWeddingEvents()
		{
			IEnumerable<EventDto> result = await _eventQueries.GetManyAsync(
				evnt => evnt.IsWeddingEvent || evnt.IsWeddingPartyEvent
			);

            return Ok(result);
        }

		[HttpGet("type/{eventType}")]
		public async Task<IActionResult> GetEventType(EventType eventType)
        {
            IEnumerable<EventDto> result = await _eventQueries.GetManyAsync(
				evnt => evnt.EventType == eventType
            );

            return Ok(result);
        }
        
        [HttpPost]
		[ClaimRequirement("UserId", "{UserId}")]
        public async Task<IActionResult> CreateEvent([FromBody]CreateEventCommand command) {
            if (command == null) {
                return BadRequest();
            }
			EventDto result = await _mediator.Send(command);
            return Ok(result);
        }

        [HttpPut]
		[ClaimRequirement("Role", "True")]
        public async Task<IActionResult> UpdateEvent([FromBody]UpdateEventCommand command)
        {
            if (command == null)
            {
                return BadRequest();
            }
			EventDto result = await _mediator.Send(command);
            return Ok(result);
        }

		[HttpPut("registerUser")]
		[ClaimRequirement("UserId", "{UserId}")]
		public async Task<IActionResult> RegisterUser([FromBody]RegisterEventCommand command) {
			if (command == null)
            {
                return BadRequest();
            }
            bool result = await _mediator.Send(command);
            return Ok(result);
		}

		[HttpPut("unregisterUser")]
        [ClaimRequirement("UserId", "{UserId}")]
        public async Task<IActionResult> UnregisterUser([FromBody]UnregisterEventCommand command)
        {
            if (command == null)
            {
                return BadRequest();
            }
            bool result = await _mediator.Send(command);
            return Ok(result);
        }

		[HttpDelete("{id}")]
		[ClaimRequirement("Role", "True")]
		public async Task<IActionResult> Delete(int id) {
			DeleteEventCommand command = new DeleteEventCommand
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
