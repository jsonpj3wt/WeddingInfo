using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using DataGenerator;
using DataGenerator.Templates;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using WeddingInfo.Domain.Commands.DeleteUser;
using WeddingInfo.Domain.Context;
using WeddingInfo.Domain.DTOs;
using WeddingInfo.Domain.Models;

namespace UnitTests.Domain.Commands
{
	public class DeleteUserTests
    {
        private readonly IMapper _mapper;

		public DeleteUserTests()
        {
            var config = new MapperConfiguration(cfg =>
            {
				cfg.CreateMap<User, UserDto>();
            });

            _mapper = config.CreateMapper();
        }

        [TestMethod]
		public async Task Handle_deletecall_does_persist()
        {
            DbContextOptions<DbContext> options = new DbContextOptionsBuilder<DbContext>()
                .UseInMemoryDatabase(nameof(Handle_deletecall_does_persist))
                .Options;

            JasonSarahContext context = new Generator(options)
                .GenerateMockData(new DefaultTemplate());

			User usr = await context.Users.FirstAsync();

			//Create Command
			var fakeCmd = new DeleteUserCommand()
			{
				Id = usr.Id
			};

            //mock and setup
            var mockMediator = new Mock<IMediator>();

            //setup
			mockMediator.Setup(x => x.Send(It.IsAny<DeleteUserCommand>(), It.IsAny<CancellationToken>()))
			            .Returns(Task.FromResult(true));

            int initial = await context.Events.CountAsync();

            var cltToken = new CancellationToken();

            var handler = new DeleteUserHandler(context);

            await handler.Handle(fakeCmd, cltToken);

			int afterUpdate = await context.Users.CountAsync();

            Assert.AreEqual(initial - 1, afterUpdate);
        }
    }
}
