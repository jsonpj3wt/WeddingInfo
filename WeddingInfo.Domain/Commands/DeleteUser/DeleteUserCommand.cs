using MediatR;

namespace WeddingInfo.Domain.Commands.DeleteUser
{
	public class DeleteUserCommand: IRequest<bool>
    {
        public int Id { get; set; }
    }
}
