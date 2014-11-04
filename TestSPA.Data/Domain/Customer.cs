using System;
using System.Collections.Generic;

namespace TestSPA.Data
{
	public class Customer : Entity
	{
		public Customer()
		{
			this.Projects = new HashSet<Project>();
		}

		public string Name { get; set; }
		public string Description { get; set; }

		public virtual ICollection<Project> Projects { get; set; }
	}
}