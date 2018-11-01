using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using DataGenerator;
using DataGenerator.Templates;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using WeddingInfo.Domain.Commands.CreateLocation;
using WeddingInfo.Domain.Commands.CreateUser;
using WeddingInfo.Domain.Context;
using WeddingInfo.Domain.DTOs;
using WeddingInfo.Domain.Models;

namespace UnitTests.Domain.Commands
{
	public class CreateUserTests
    {
        private readonly IMapper _mapper;

		public CreateUserTests()
        {
            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<User, CreateUserCommand>();
				cfg.CreateMap<CreateUserCommand, UserDto>();
				cfg.CreateMap<User, UserDto>();
            });

            _mapper = config.CreateMapper();
        }

        [TestMethod]
        public async Task Handle_createcall_does_persist()
        {
            DbContextOptions<DbContext> options = new DbContextOptionsBuilder<DbContext>()
                .UseInMemoryDatabase(nameof(Handle_createcall_does_persist))
                .Options;

            JasonSarahContext context = new Generator(options)
                .GenerateMockData(new DefaultTemplate());

			User usr = await context.Users.FirstAsync();

            //Create Command
            var fakeCmd = _mapper.Map<User, CreateUserCommand>(usr);
            usr.Id += 100;

            //mock and setup
            var mockMediator = new Mock<IMediator>();

            //setup
			mockMediator.Setup(x => x.Send(It.IsAny<CreateUserCommand>(), It.IsAny<CancellationToken>()))
			            .Returns(Task.FromResult(_mapper.Map<CreateUserCommand, UserDto>(fakeCmd)));
            
            int initial = await context.Events.CountAsync();

            var cltToken = new CancellationToken();

            var handler = new CreateUserHandler(context);

            await handler.Handle(fakeCmd, cltToken);

			int afterUpdate = await context.Users.CountAsync();

            Assert.AreEqual(initial + 1, afterUpdate);
        }
    }
}
