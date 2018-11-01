using MediatR;

namespace WeddingInfo.Domain.Commands.DeleteLodging
{
	public class DeleteLodgingCommand: IRequest<bool>
    {
		public int Id { get; set; }
    }
}
