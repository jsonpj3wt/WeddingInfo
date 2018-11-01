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

namespace WeddingInfo.Domain.Commands.UpdateHomeComponent
{
	public class UpdateHomeHandler: IRequestHandler<UpdateHomeCommand, HomeComponentDto>
    {
		private readonly IJasonSarahContext _context;
		private readonly IMapper _mapper;
		public UpdateHomeHandler(IJasonSarahContext context) {
			_context = context;

			var config = new MapperConfiguration(cfg =>
			{
				cfg.AllowNullCollections = true;
				cfg.CreateMap<UpdateHomeCommand, HomeComponent>();
				cfg.CreateMap<Section, SectionDto>();
				cfg.CreateMap<SectionDto, Section>();
				cfg.CreateMap<Parallax, ParallaxDto>();
				cfg.CreateMap<ParallaxDto, Parallax>();
				cfg.CreateMap<HomeComponent, HomeComponentDto>();
			});

			_mapper = config.CreateMapper();
		}

		public async Task<HomeComponentDto> Handle(UpdateHomeCommand command, CancellationToken cancellationToken) {
			HomeComponent theHomeComponent = await _context
				.HomeComponents
				.Include(h => h.Sections)
				.ThenInclude(s => s.BottomParallax)
				.Include(h => h.Sections)
                .ThenInclude(s => s.TopParallax)
				.FirstOrDefaultAsync(h => h.Id == command.Id);

			IList<Section> sections = theHomeComponent.Sections.ToList();
			
            //Make sure any new sections are added.
			foreach (var commandSection in command.Sections)
            {
				var section = sections.FirstOrDefault(sec => sec.Id == commandSection.Id && commandSection.Id != 0);
                if (section != null)
                {
                    section.Header = commandSection.Header;
					section.Text = commandSection.Text;
					if (section.TopParallax != null && section.TopParallax.Id > 0)
					{
						section.TopParallax.ImgUrl = commandSection.TopParallax.ImgUrl;
					}
					else
					{
						section.TopParallax = _mapper.Map<ParallaxDto, Parallax>(commandSection.TopParallax);
					}

					if (section.BottomParallax != null && section.BottomParallax.Id > 0)
                    {
                        section.BottomParallax.ImgUrl = commandSection.BottomParallax.ImgUrl;
                    }
                    else
                    {
						section.BottomParallax = _mapper.Map<ParallaxDto, Parallax>(commandSection.BottomParallax);
                    }
					        
                }
                else
                {
					sections.Add(_mapper.Map<SectionDto, Section>(commandSection));
                }
            }

			var deleteSections = new List<Section>();

            //Make sure any deleted sections are removed.
            for (int i = 0; i < sections.Count(); i++)
            {
				var section = sections[i];
				if (!command.Sections.Any(sec => sec.Id == 0 || sec.Id == section.Id))
                {
					deleteSections.Add(section);
                    sections.RemoveAt(i);
                    i--;
                }
            }

            command.Sections = null;

			theHomeComponent = _mapper.Map<UpdateHomeCommand, HomeComponent>(command, theHomeComponent);
			theHomeComponent.Sections = sections;

			_context.HomeComponents.Update(theHomeComponent);

			foreach(var section in deleteSections){
				if (section.BottomParallax != null) {
					_context.Parallaxes.Remove(section.BottomParallax);
				}
				if (section.TopParallax != null) {
					_context.Parallaxes.Remove(section.TopParallax);
				}
				_context.Sections.Remove(section);
			}

			_context.Commit();
			return _mapper.Map<HomeComponent, HomeComponentDto>(theHomeComponent);
		}
    }
}
