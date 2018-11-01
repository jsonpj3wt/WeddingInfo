using System;
using WeddingInfo.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace WeddingInfo.Domain.Context
{
    public interface IJasonSarahContext
    {
		DbSet<User> Users { get; set; }

        DbSet<Event> Events { get; set; }

        DbSet<Location> Locations { get; set; }

		DbSet<Lodging> Lodgings { get; set; }

		DbSet<Media> Medias { get; set; }

		DbSet<Registry> Registries { get; set; }

		DbSet<HomeComponent> HomeComponents { get; set; }

		DbSet<Section> Sections { get; set; }
        
		DbSet<Parallax> Parallaxes { get; set; }

		void Commit();
    }
}
