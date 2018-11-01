using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using DataGenerator;
using DataGenerator.Templates;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using WeddingInfo.Domain.Commands.DeleteEvent;
using WeddingInfo.Domain.Context;
using WeddingInfo.Domain.DTOs;
using WeddingInfo.Domain.Models;

namespace UnitTests.Domain.Commands
{
	public class DeleteEventTests
    {
        private readonly IMapper _mapper;

		public DeleteEventTests()
        {
            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<Event, EventDto>();
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

            Event evnt = await context.Events.FirstAsync();

            //Create Command
			var fakeCmd = new DeleteEventCommand()
            {
                Id = evnt.Id
            };

            //mock and setup
            var mockMediator = new Mock<IMediator>();
            
            //setup
            mockMediator.Setup(x => x.Send(It.IsAny<DeleteEventCommand>(), It.IsAny<CancellationToken>()))
                        .Returns(Task.FromResult(true));

            int initial = await context.Events.CountAsync();

            var cltToken = new CancellationToken();

			var handler = new DeleteEventHandler(context);

            await handler.Handle(fakeCmd, cltToken);

            int afterUpdate = await context.Events.CountAsync();

            Assert.AreEqual(initial - 1, afterUpdate);
        }
    }
}
