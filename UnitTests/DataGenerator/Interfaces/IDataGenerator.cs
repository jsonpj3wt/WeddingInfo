using System;
using WeddingInfo.Domain.Context;
using WeddingInfo.Domain.Models;

namespace DataGenerator.Interfaces
{
	public interface IDataGenerator: IDisposable
	{
        
		JasonSarahContext GenerateMockData(ITemplate template, JasonSarahContext context = null);


		Event BuildEvent();
		Location BuildLocation();
		Lodging BuildLodging();
		Media BuildMedia();
		User BuildUser();      

    }
}
