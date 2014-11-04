using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using TestSPA.DataTransferObjects;

namespace TestSPA.Helpers
{
    public class CustomerRowsContainer
    {
        public ICollection<CustomerDto> Customers { get; set; }

        public int Count { get; set; }
    }
}