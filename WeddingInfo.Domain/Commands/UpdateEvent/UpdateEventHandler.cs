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

namespace WeddingInfo.Domain.Commands.UpdateEvent
{
	public class UpdateEventHandler: IRequestHandler<UpdateEventCommand, EventDto>
    {
		private readonly IJasonSarahContext _context;
		private readonly IMapper _mapper;
		public UpdateEventHandler(IJasonSarahContext context) {
			_context = context;

			var config = new MapperConfiguration(cfg =>
			{
				cfg.CreateMap<UpdateEventCommand, Event>();
				cfg.CreateMap<Media, MediaDto>();
				cfg.CreateMap<MediaDto, Media>();
				cfg.CreateMap<User, UserDto>();
				cfg.CreateMap<UserDto, User>();
				cfg.CreateMap<Event, EventDto>();
			});

			_mapper = config.CreateMapper();
		}

		public async Task<EventDto> Handle(UpdateEventCommand command, CancellationToken cancellationToken) {
			Event theEvent = await _context
				.Events
				.FindAsync(command.Id);

			IList<Media> images = await _context
                .Medias
                .Where(m => command.Images.Any(i => i.Id == m.Id)).ToListAsync();

            IList<Media> videos = await _context
                .Medias
                .Where(m => command.Videos.Any(i => i.Id == m.Id)).ToListAsync();

			IList<User> guests = await _context
				.Users
				.Where(u => command.Guests.Any(cu => cu.Id == u.Id)).ToListAsync();

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
                    images.Add(_mapper.Map<MediaDto, Media>(commandImage));
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

			//Make sure any new guests are added.
			foreach (var commandGuest in command.Guests)
            {
				var guest = guests.FirstOrDefault(u => u.Id == commandGuest.Id);
                if (guest == null)
                {
					guests.Add(_mapper.Map<UserDto, User>(commandGuest));
                }
            }

            //Make sure any deleted guests are removed.
            for (int i = 0; i < guests.Count(); i++)
            {
				var guest = guests[i];
				if (!command.Guests.Any(u => u.Id == 0 || u.Id == guest.Id))
                {
                    guests.RemoveAt(i);
                    i--;
                }
            }

            command.Images = null;
            command.Videos = null;
			command.Guests = null;

			theEvent = _mapper.Map<UpdateEventCommand, Event>(command, theEvent);
			theEvent.Images = images;
			theEvent.Videos = videos;
			theEvent.Guests = guests;

			_context.Events.Update(theEvent);
			_context.Commit();
			return _mapper.Map<Event, EventDto>(theEvent);
		}
    }
}
