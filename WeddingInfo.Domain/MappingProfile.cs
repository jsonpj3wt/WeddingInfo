using System;
using AutoMapper;
using WeddingInfo.Domain.DTOs;
using WeddingInfo.Domain.Models;

namespace WeddingInfo.Domain
{
	public class MappingProfile: Profile
    {
        public MappingProfile()
        {
			AllowNullCollections = true;
			CreateMap<User, UserDto>();
			CreateMap<Event, EventDto>();
			CreateMap<Location, LocationDto>();
			CreateMap<Lodging, LodgingDto>();
			CreateMap<Media, MediaDto>();
			CreateMap<Registry, RegistryDto>();
			CreateMap<HomeComponent, HomeComponentDto>();
			CreateMap<Section, SectionDto>();
			CreateMap<Parallax, ParallaxDto>();
            
			CreateMap<UserDto, User>();
			CreateMap<EventDto, Event>();
			CreateMap<LocationDto, Location>();
			CreateMap<LodgingDto, Lodging>();
			CreateMap<MediaDto, Media>();
			CreateMap<RegistryDto, Registry>();
			CreateMap<HomeComponentDto, HomeComponent>();
            CreateMap<SectionDto, Section>();
            CreateMap<ParallaxDto, Parallax>();
        }
    }
}
