using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using WeddingInfo.Domain.Context;
using WeddingInfo.Domain.DTOs;
using WeddingInfo.Domain.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace WeddingInfo.Domain.Commands.UpdateRegistry
{
	public class UpdateRegistryHandler: IRequestHandler<UpdateRegistryCommand, RegistryDto>
    {
		private readonly IJasonSarahContext _context;
		private readonly IMapper _mapper;
		public UpdateRegistryHandler(IJasonSarahContext context) {
			_context = context;

			var config = new MapperConfiguration(cfg =>
			{
				cfg.CreateMap<UpdateRegistryCommand, Registry>();
				cfg.CreateMap<Registry, RegistryDto>();
			});

			_mapper = config.CreateMapper();
		}

		public async Task<RegistryDto> Handle(UpdateRegistryCommand command, CancellationToken cancellationToken) {
			Registry theRegistry = await _context
				.Registries
				.FindAsync(command.Id);         

			theRegistry = _mapper.Map<UpdateRegistryCommand, Registry>(command, theRegistry);

			_context.Registries.Update(theRegistry);
			_context.Commit();
			return _mapper.Map<Registry, RegistryDto>(theRegistry);
		}
    }
}
