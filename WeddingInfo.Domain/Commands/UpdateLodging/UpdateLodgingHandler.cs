using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using WeddingInfo.Domain.Context;
using WeddingInfo.Domain.DTOs;
using WeddingInfo.Domain.Models;
using MediatR;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace WeddingInfo.Domain.Commands.UpdateLodging
{
	public class UpdateLodgingHandler: IRequestHandler<UpdateLodgingCommand, LodgingDto>
    {
        private readonly IJasonSarahContext _context;
        private readonly IMapper _mapper;

		public UpdateLodgingHandler(IJasonSarahContext context) {
            _context = context;

            var config = new MapperConfiguration(cfg =>
            {
				cfg.CreateMap<UpdateLodgingCommand, Lodging>();
				cfg.CreateMap<Lodging, LodgingDto>();
            });
			_mapper = config.CreateMapper();
        }

		public async Task<LodgingDto> Handle(UpdateLodgingCommand command, CancellationToken cancellationToken) {
			Lodging theLodging = await _context
				.Lodgings
				.FindAsync(command.Id);

            IList<Media> images = await _context
                .Medias
                .Where(m => command.Images.Any(i => i.Id == m.Id)).ToListAsync();

            IList<Media> videos = await _context
                .Medias
                .Where(m => command.Videos.Any(i => i.Id == m.Id)).ToListAsync();

            //Make sure any new images are added.
            foreach (var commandImage in command.Images)
            {
                var image = images.FirstOrDefault(img => img.Id == commandImage.Id && img.Id != 0);
                if (image != null)
                {
                    image.Path = commandImage.Path;
                }
                else
                {
                    Media newImage = _mapper.Map<MediaDto, Media>(commandImage);
                    images.Add(newImage);
                }
            }

            //Make sure any deleted images are removed.
            for (int i = 0; i < images.Count(); i++)
            {
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
                    Media newVideo = _mapper.Map<MediaDto, Media>(commandVideo);
                    videos.Add(newVideo);
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

            theLodging = _mapper.Map<UpdateLodgingCommand, Lodging>(command, theLodging);
            theLodging.Images = images;
            theLodging.Videos = videos;
            _context.Lodgings.Update(theLodging);

			_context.Commit();
			return _mapper.Map<Lodging, LodgingDto>(theLodging);
        }
    }
}
