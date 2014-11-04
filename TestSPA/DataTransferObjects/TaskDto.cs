using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TestSPA.DataTransferObjects
{
    public class TaskDto
    {
        public string Name { get; set; }

        public int ProjectId { get; set; }
        public virtual ProjectDto Project { get; set; }
    }
}