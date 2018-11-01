using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using DataGenerator;
using DataGenerator.Templates;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using WeddingInfo.Domain.Commands.CreateLodging;
using WeddingInfo.Domain.Context;
using WeddingInfo.Domain.DTOs;
using WeddingInfo.Domain.Models;

namespace UnitTests.Domain.Commands
{
	public class CreateLodgingTests
    {
        private readonly IMapper _mapper;
        
		public CreateLodgingTests()
        {
            var config = new MapperConfiguration(cfg =>
            {
				cfg.CreateMap<Lodging, CreateLodgingCommand>();
				cfg.CreateMap<CreateLodgingCommand, LodgingDto>();
				cfg.CreateMap<Lodging, LodgingDto>();
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

			Lodging lodging = await context.Lodgings.FirstAsync();
            
            //Create Command
			var fakeCmd = _mapper.Map<Lodging, CreateLodgingCommand>(lodging);
            lodging.Id += 100;

            //mock and setup
            var mockMediator = new Mock<IMediator>();

            //setup
			mockMediator.Setup(x => x.Send(It.IsAny<CreateLodgingCommand>(), It.IsAny<CancellationToken>()))
			            .Returns(Task.FromResult(_mapper.Map<CreateLodgingCommand, LodgingDto>(fakeCmd)));

            int initial = await context.Events.CountAsync();

            var cltToken = new CancellationToken();

			var handler = new CreateLodgingHandler(context);

            await handler.Handle(fakeCmd, cltToken);

			int afterUpdate = await context.Lodgings.CountAsync();

            Assert.AreEqual(initial + 1, afterUpdate);
        }
    }
}
