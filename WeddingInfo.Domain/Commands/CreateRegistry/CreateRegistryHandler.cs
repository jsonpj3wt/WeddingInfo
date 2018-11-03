using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using WeddingInfo.Domain.Context;
using WeddingInfo.Domain.DTOs;
using WeddingInfo.Domain.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace WeddingInfo.Domain.Commands.CreateRegistry
{
	public class CreateRegistryHandler: IRequestHandler<CreateRegistryCommand, RegistryDto>
    {
		private readonly IJasonSarahContext _context;
		private readonly IMapper _mapper;

		public CreateRegistryHandler(IJasonSarahContext context) {
			_context = context;

			var config = new MapperConfiguration(cfg =>
			{
				cfg.CreateMap<CreateRegistryCommand, Registry>();
				cfg.CreateMap<Registry, RegistryDto>();
			});

			_mapper = config.CreateMapper();
		}

		public async Task<RegistryDto> Handle(CreateRegistryCommand request, CancellationToken cancellationToken) {
			Registry newRegistry = _mapper.Map<CreateRegistryCommand, Registry>(request);
            int count = await _context.Registries.CountAsync();
            newRegistry.Order = count + 1;
            await _context.Registries.AddAsync(newRegistry);
			_context.Commit();
			return _mapper.Map<Registry, RegistryDto>(newRegistry);
		}
    }
}
