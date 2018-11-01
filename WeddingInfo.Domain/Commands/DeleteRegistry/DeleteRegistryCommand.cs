using MediatR;

namespace WeddingInfo.Domain.Commands.DeleteRegistry
{
	public class DeleteRegistryCommand: IRequest<bool>
    {
		public int Id { get; set; }
    }
}
