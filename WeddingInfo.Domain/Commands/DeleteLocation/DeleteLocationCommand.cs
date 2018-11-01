using MediatR;

namespace WeddingInfo.Domain.Commands.DeleteLocation
{
	public class DeleteLocationCommand: IRequest<bool>
    {
		public int Id { get; set; }
    }
}
