using System;
using System.Collections.Generic;
using WeddingInfo.Domain.DTOs;
using WeddingInfo.Domain.Enumerations;
using MediatR;

namespace WeddingInfo.Domain.Commands.CreateEvent
{
	public class CreateEventCommand: IRequest<EventDto>
    {
		public int Id { get; set; }
        public string Name { get; set; }
		public string Description { get; set; }
        public DateTime Occurance { get; set; }
        public string Address { get; set; }
		public IList<MediaDto> Images { get; set; } = new List<MediaDto>();
        public IList<MediaDto> Videos { get; set; } = new List<MediaDto>();
        public EventType EventType { get; set; }
        public EventDifficulty EventDifficulty { get; set; }
        public bool IsWeddingEvent { get; set; }
		public bool IsWeddingPartyEvent { get; set; }
    }
}
