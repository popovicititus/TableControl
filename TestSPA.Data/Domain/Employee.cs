using System;
using System.Collections.Generic;

namespace TestSPA.Data
{
	public class Employee : Entity
	{
		public Employee()
		{
			this.Activities = new HashSet<Activity>();
		}

		public string UserName { get; set; }
		public string FirstName { get; set; }
		public string LastName { get; set; }

		public virtual ICollection<Activity> Activities { get; set; }
	}
}