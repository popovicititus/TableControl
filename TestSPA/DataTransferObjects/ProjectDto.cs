using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TestSPA.DataTransferObjects
{
    public class ProjectDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime From { get; set; }
        public DateTime To { get; set; }
        public int Status { get; set; } // planned, in progress, completed, cancelled
        public string Description { get; set; }

        public int CustomerId { get; set; }
        public virtual CustomerDto Customer { get; set; }

        public virtual ICollection<TaskDto> Tasks { get; set; }
    }
}