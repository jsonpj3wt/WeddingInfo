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

namespace WeddingInfo.Domain.Commands.UpdateLocation
{
	public class UpdateLocationHandler: IRequestHandler<UpdateLocationCommand, LocationDto>
    {
        private readonly IJasonSarahContext _context;
        private readonly IMapper _mapper;
		public UpdateLocationHandler(IJasonSarahContext context) {
            _context = context;

            var config = new MapperConfiguration(cfg =>
            {
				cfg.CreateMap<UpdateLocationCommand, Location>();
				cfg.CreateMap<Media, MediaDto>();
				cfg.CreateMap<MediaDto, Media>();
				cfg.CreateMap<Location, LocationDto>();
            });
			_mapper = config.CreateMapper();
        }

		public async Task<LocationDto> Handle(UpdateLocationCommand command, CancellationToken cancellationToken) {
			Location theLocation = await _context
				.Locations
				.FindAsync(command.Id);

			IList<Media> images = await _context
				.Medias
				.Where(m => command.Images.Any(i => i.Id == m.Id)).ToListAsync();
			
			IList<Media> videos = await _context
                .Medias
                .Where(m => command.Videos.Any(i => i.Id == m.Id)).ToListAsync();

            //Make sure any new images are added.
			foreach(var commandImage in command.Images) 
			{	
				var image = images.FirstOrDefault(img => img.Id == commandImage.Id && img.Id != 0);
				if (image != null) {
					image.Path = commandImage.Path;
				}
				else {
					images.Add(_mapper.Map<MediaDto, Media>(commandImage));
				}
			}

			//Make sure any deleted images are removed.
			for (int i = 0; i < images.Count(); i++) {
				var image = images[i];
				if (!command.Images.Any(img => img.Id == 0 || img.Id == image.Id))
				{
					images.RemoveAt(i);
					i--;
				}
			}

			//Make sure any new videos are added.
			foreach (var commandVideo in command.Images)
            {
				var video = videos.FirstOrDefault(vid => vid.Id == commandVideo.Id && vid.Id != 0);
				if (video != null)
                {
					video.Path = commandVideo.Path;
                }
                else
                {
					videos.Add(_mapper.Map<MediaDto, Media>(commandVideo));
                }
            }

			//Make sure any deleted videos are removed.
			for (int i = 0; i < videos.Count(); i++)
            {
				var video = videos[i];
				if (!command.Videos.Any(vid => vid.Id == 0 || vid.Id == video.Id))
                {
                    videos.RemoveAt(i);
                    i--;
                }
            }

			command.Images = null;
			command.Videos = null;

			theLocation = _mapper.Map<UpdateLocationCommand, Location>(command, theLocation);
			theLocation.Images = images;
			theLocation.Videos = videos;
			_context.Locations.Update(theLocation);

			_context.Commit();
			return _mapper.Map<Location, LocationDto>(theLocation);
        }
    }
}
