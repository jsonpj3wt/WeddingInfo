using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using DataGenerator;
using DataGenerator.Templates;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using WeddingInfo.Domain.Commands.DeleteLocation;
using WeddingInfo.Domain.Context;
using WeddingInfo.Domain.DTOs;
using WeddingInfo.Domain.Models;

namespace UnitTests.Domain.Commands
{
	public class DeleteLocationTests
    {
        private readonly IMapper _mapper;

		public DeleteLocationTests()
        {
            var config = new MapperConfiguration(cfg =>
            {
				cfg.CreateMap<Location, LocationDto>();
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

			Location loc = await context.Locations.FirstAsync();

            //Create Command
            var fakeCmd = new DeleteLocationCommand()
            {
                Id = loc.Id
            };

            //mock and setup
            var mockMediator = new Mock<IMediator>();
            
            //setup
			mockMediator.Setup(x => x.Send(It.IsAny<DeleteLocationCommand>(), It.IsAny<CancellationToken>()))
                        .Returns(Task.FromResult(true));

            int initial = await context.Events.CountAsync();

            var cltToken = new CancellationToken();

			var handler = new DeleteLocationHandler(context);

            await handler.Handle(fakeCmd, cltToken);

			int afterUpdate = await context.Locations.CountAsync();

            Assert.AreEqual(initial - 1, afterUpdate);
        }
    }
}
