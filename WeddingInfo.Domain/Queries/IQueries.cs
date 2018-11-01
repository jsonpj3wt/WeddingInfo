using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
namespace WeddingInfo.Domain.Queries
{
	public interface IQueries<D, T> where D: class where T: class
    {
		Task<D> GetById(int Id);
        Task<IEnumerable<D>> GetAll();
        Task<IEnumerable<D>> GetManyAsync(Expression<Func<T, bool>> where);
    }
}
