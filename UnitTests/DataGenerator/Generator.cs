using System;
using System.Collections.Generic;
using System.Linq;
using DataGenerator.Interfaces;
using FizzWare.NBuilder;
using Microsoft.EntityFrameworkCore;
using WeddingInfo.Domain.Context;
using WeddingInfo.Domain.Models;

namespace DataGenerator
{
	public class Generator : IDataGenerator, IDisposable
	{
		private JasonSarahContext _context;
		private List<Event> _events;
		private List<Location> _locations;
		private List<Lodging> _lodgings;
		private List<Media> _medias;
		private List<User> _users;

		public Generator(DbContextOptions<DbContext> options = null) {
			options = options ?? GetDefaultOptions();
			_context = new JasonSarahContext(options);
		}


		public Event BuildEvent()
		{
			var guest = BuildUser();
			var evnt = new Event
			{
				Address = "123 Event Dr.",
				Description = "Test Event Description",
				EventDifficulty = WeddingInfo.Domain.Enumerations.EventDifficulty.Easy,
				EventType = WeddingInfo.Domain.Enumerations.EventType.Biking,
				Guests = new List<User> {
					guest
				},
				Id = 300,
				Images = new List<Media> {
					new Media() {
						Id = 100,
						MediaType = WeddingInfo.Domain.Enumerations.MediaType.Image,
						Path = "test/path.png"
					}
				},
				IsWeddingEvent = true,
				IsWeddingPartyEvent = false,
				Name = "Test Event",
				Occurance = DateTime.Now,
				Videos = new List<Media> {
					new Media() {
    					Id = 101,
    					MediaType = WeddingInfo.Domain.Enumerations.MediaType.Video,
    					Path = "test/path/12312"
    				}
				}
			};

			return evnt;
		}

		public Location BuildLocation()
		{
			var loc = new Location()
			{
				Address = "123 Locaiton Dr.",
				Description = "Test Location Description",
				Id = 300,
				Images = new List<Media> {
                    new Media() {
    					Id = 102,
    					MediaType = WeddingInfo.Domain.Enumerations.MediaType.Image,
    					Path = "test/path.png"
					}
				},
				Name = "Test Event",
				Website = "https://google.com/location",
				Videos = new List<Media> {
                    new Media() {
    					Id = 103,
    					MediaType = WeddingInfo.Domain.Enumerations.MediaType.Video,
    					Path = "test/path/12312"
					}
				}
			};

			return loc;
		}

		public Lodging BuildLodging()
		{
			var lodging = new Lodging()
			{
				Address = "123 Locaiton Dr.",
				Description = "Test Location Description",
				Id = 300,
				Images = new List<Media> {
                    new Media() {
    					Id = 104,
    					MediaType = WeddingInfo.Domain.Enumerations.MediaType.Image,
    					Path = "test/path.png"
					}
				},
				Name = "Test Event",
				Website = "https://google.com/location",
				Videos = new List<Media> {
                    new Media() {
    					Id = 105,
    					MediaType = WeddingInfo.Domain.Enumerations.MediaType.Video,
    					Path = "test/path/12312"
					}
				}
			};
			return lodging;
		}

		public Media BuildMedia()
		{
			var media = new Media()
			{
				Id = 106,
				MediaType = WeddingInfo.Domain.Enumerations.MediaType.Image,
				Path = "test/path.png"
			};

			return media;
		}

		public User BuildUser()
		{
			var usr = new User()
			{
				Address = "123 User",
				Category = "Test Cat.",
				Dietary = "Chicken",
				Email = "test@email.com",
				FirstName = "Test",
				Gift = "Test Roller",
				Guests = 3,
				Household = "Test House",
				Id = 401,
				IsAdmin = false,
				IsAttending = true,
				IsGuest = false,
				LastName = "Tester",
				MiddleName = "Tess",
				Password = "abc123",
				PhoneNumber = "1234567890",
				Rehearsal =false,
				SentSaveTheDate = true,
				SentThankYou = true,
				Title = "Mrs."
			};
			return usr;
		}

		public void Dispose()
		{
			_events = null;
			_users = null;
			_medias = null;
			_lodgings = null;
			_locations = null;
			_context.Dispose();
			_context = null;
		}

		public JasonSarahContext GenerateMockData(ITemplate template, JasonSarahContext context = null)
		{
			if (context != null) {
				_context = context;
			}

			if (template.EventCount > 0) {
				int eventId = 1;
				_events = Builder<Event>
					.CreateListOfSize(template.EventCount)
					.All()
					.With(evnt => evnt.Id == eventId++)
					.Build()
					.ToList();
				_context.Events.AddRange(_events);
			}

			if (template.LocationCount > 0)
            {
                int locId = 1;
				_locations = Builder<Location>
					.CreateListOfSize(template.LocationCount)
                    .All()
                    .With(loc => loc.Id == locId++)
                    .Build()
                    .ToList();
				_context.Locations.AddRange(_locations);
            }

			if (template.LodgingCount > 0)
            {
                int lodgingId = 1;
				_lodgings = Builder<Lodging>
					.CreateListOfSize(template.LodgingCount)
                    .All()
                    .With(lodging => lodging.Id == lodgingId++)
                    .Build()
                    .ToList();
				_context.Lodgings.AddRange(_lodgings);
            }

			if (template.MediaCount > 0)
            {
                int mediaId = 1;
				_medias = Builder<Media>
					.CreateListOfSize(template.MediaCount)
                    .All()
                    .With(media => media.Id == mediaId++)
                    .Build()
                    .ToList();
				_context.Medias.AddRange(_medias);
            }

			if (template.UserCount > 0)
            {
                int userId = 1;
				_users = Builder<User>
					.CreateListOfSize(template.UserCount)
                    .All()
                    .With(usr => usr.Id == userId++)
                    .Build()
                    .ToList();
				_context.Users.AddRange(_users);
            }

			return _context;
		}

		private static DbContextOptions<DbContext> GetDefaultOptions() {
			return new DbContextOptionsBuilder<DbContext>()
				.UseInMemoryDatabase("JasonSarahContext")
				.Options;
		}
	}
}
