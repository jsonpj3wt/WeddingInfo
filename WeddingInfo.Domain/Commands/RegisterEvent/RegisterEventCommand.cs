using MediatR;

namespace WeddingInfo.Domain.Commands.RegisterEvent
{
	public class RegisterEventCommand: IRequest<bool>
    {
		public int EventId { get; set; }
		public int UserId { get; set; }
    }
}
