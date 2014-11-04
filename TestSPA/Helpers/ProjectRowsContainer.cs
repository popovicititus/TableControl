using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using TestSPA.DataTransferObjects;

namespace TestSPA.Helpers
{
    public class ProjectRowsContainer
    {
        public ICollection<ProjectDto> Projects { get; set; }

        public int Count { get; set; }
    }

    public class ProjectIdsContainer
    {
        public IEnumerable<int> ids { get; set; } 
    }
}