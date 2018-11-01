using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace WeddingInfo.Domain.Models
{
    public class User
    {
		public int Id { get; set; }
		public bool IsAdmin { get; set; }
		[MaxLength(516)]
		public string Password { get; set; }      
		[MaxLength(36)]
		public string FirstName { get; set; }
		[MaxLength(36)]
		public string LastName { get; set; }
		[MaxLength(36)]
		public string MiddleName { get; set; }
		[MaxLength(100)]
		public string Address { get; set; }
		[MaxLength(36)]
		public string PhoneNumber { get; set; }
		[MaxLength(100)]
		public string Email { get; set; }
		public bool IsAttending { get; set; }
		public bool IsGuest { get; set; }
		public int Guests { get; set; }
		[MaxLength(300)]
		public string Icon { get; set; }
		[MaxLength(36)]
		public string Category { get; set; }
		[MaxLength(36)]
		public string Household { get; set; }
		public bool SentSaveTheDate { get; set; }
        public bool Rehearsal { get; set; }
		[MaxLength(200)]
        public string Dietary { get; set; }
		[MaxLength(200)]
        public string Gift { get; set; }
        public bool SentThankYou { get; set; }
		[MaxLength(100)]
		public string Title { get; set; }
    }
}
