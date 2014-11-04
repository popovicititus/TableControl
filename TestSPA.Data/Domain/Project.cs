using System;
using System.Collections.Generic;

namespace TestSPA.Data
{
	public class Project : Entity
	{
		public Project()
		{
			this.Tasks = new HashSet<Task>();
		}

		public string Name { get; set; }
		public DateTime From { get; set; }
		public DateTime To { get; set; }
		public int Status { get; set; } // planned, in progress, completed, cancelled
		public string Description { get; set; }

		public int CustomerId { get; set; }
		public virtual Customer Customer { get; set; }

		public virtual ICollection<Task> Tasks { get; set; }
	}
}