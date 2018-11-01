using MediatR;

namespace WeddingInfo.Domain.Commands.UnregisterEvent
{
	public class UnregisterEventCommand: IRequest<bool>
    {
		public int EventId { get; set; }
		public int UserId { get; set; }
    }
}
