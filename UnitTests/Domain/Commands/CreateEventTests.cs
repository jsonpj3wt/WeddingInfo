using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using DataGenerator;
using DataGenerator.Templates;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using WeddingInfo.Domain.Commands.CreateEvent;
using WeddingInfo.Domain.Context;
using WeddingInfo.Domain.DTOs;
using WeddingInfo.Domain.Models;

namespace UnitTests.Domain.Commands
{
	public class CreateEventTests
    {
		private readonly IMapper _mapper;
        
		public CreateEventTests()
        {
			var config = new MapperConfiguration(cfg =>
            {
				cfg.CreateMap<Event, CreateEventCommand>();
                cfg.CreateMap<CreateEventCommand, EventDto>();
                cfg.CreateMap<Event, EventDto>();
            });

            _mapper = config.CreateMapper();
        }

        [TestMethod]
		public async Task Handle_createcall_does_persist() {
			DbContextOptions<DbContext> options = new DbContextOptionsBuilder<DbContext>()
				.UseInMemoryDatabase(nameof(Handle_createcall_does_persist))
				.Options;

			JasonSarahContext context = new Generator(options)
				.GenerateMockData(new DefaultTemplate());

			Event evnt = await context.Events.FirstAsync();

			//Create Command
			var fakeCmd = _mapper.Map<Event, CreateEventCommand>(evnt);
			evnt.Id += 100;

			//mock and setup
			var mockMediator = new Mock<IMediator>();

			//setup
			mockMediator.Setup(x => x.Send(It.IsAny<CreateEventCommand>(), It.IsAny<CancellationToken>()))
			            .Returns(Task.FromResult(_mapper.Map<CreateEventCommand, EventDto>(fakeCmd)));

			int initial = await context.Events.CountAsync();

			var cltToken = new CancellationToken();

			var handler = new CreateEventHandler(context);

			await handler.Handle(fakeCmd, cltToken);

			int afterUpdate = await context.Events.CountAsync();

			Assert.AreEqual(initial + 1, afterUpdate);
		}
    }
}
