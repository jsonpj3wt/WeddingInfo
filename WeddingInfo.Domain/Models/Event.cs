using System;
using System.Collections.Generic;
using WeddingInfo.Domain.Enumerations;

namespace WeddingInfo.Domain.Models
{
    public class Event
    {
		public int Id { get; set; }
		public string Name { get; set; }
		public string Description { get; set; }
        public int Order { get; set; }
		public DateTime Occurance { get; set; }
		public string Address { get; set; }
		public IList<User> Guests { get; set; } = new List<User>();
		public IList<Media> Images { get; set; } = new List<Media>();
        public IList<Media> Videos { get; set; } = new List<Media>();
		public EventType EventType { get; set; }
		public EventDifficulty EventDifficulty { get; set; }
		public bool IsWeddingEvent { get; set; }
		public bool IsWeddingPartyEvent { get; set; }
    }
}
