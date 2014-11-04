using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TestSPA.DataTransferObjects
{
    public class CustomerDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        public virtual ICollection<ProjectDto> Projects { get; set; }
    }
}