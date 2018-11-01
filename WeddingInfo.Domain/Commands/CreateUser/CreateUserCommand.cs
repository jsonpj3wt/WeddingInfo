using WeddingInfo.Domain.DTOs;
using MediatR;

namespace WeddingInfo.Domain.Commands.CreateUser
{
	public class CreateUserCommand: IRequest<UserDto>
    {
		public int Id { get; set; }
        public bool IsAdmin { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string MiddleName { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public bool IsAttending { get; set; }
		public bool IsGuest { get; set; }
        public string Icon { get; set; }
		public int Guests { get; set; }
		public string Category { get; set; }
		public string Household { get; set; }
		public bool SentSaveTheDate { get; set; }
		public bool Rehearsal { get; set; }
        public string Dietary { get; set; }
        public string Gift { get; set; }
        public bool SentThankYou { get; set; }
		public string Title { get; set; }
    }
}
