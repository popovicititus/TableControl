using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Http;
using TestSPA.Data;
using TestSPA.DataTransferObjects;
using TestSPA.Extensions;
using TestSPA.Helpers;

namespace TestSPA.Controllers
{
    public class CustomerController : ApiController
    {
        private readonly DatabaseContext dbContext  = new DatabaseContext();

        [HttpGet]
        public CustomerRowsContainer ReadLookupPage(int skip = 0, string order = "", int take = 10, string filter = null)
        {
            return new CustomerRowsContainer
            {
                Customers = dbContext.Customers
                    .OrderBy(c => c.Name)
                    .Skip(skip)
                    .Take(take)
                    .AsNoTracking()
                    .AsEnumerable()
                    .Select(c => c.ConvertToDto())
                    .ToList(),
                Count = 300
            };
        }
	}
}