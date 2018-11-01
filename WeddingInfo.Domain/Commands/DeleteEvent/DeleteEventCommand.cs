using MediatR;

namespace WeddingInfo.Domain.Commands.DeleteEvent
{
	public class DeleteEventCommand: IRequest<bool>
    {
		public int Id { get; set; }
    }
}
