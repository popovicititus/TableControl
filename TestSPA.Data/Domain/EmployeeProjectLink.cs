using System;
using System.Collections.Generic;

namespace TestSPA.Data
{
	public class EmployeeProjectLink : Entity
	{
		public DateTime From { get; set; }
		public DateTime To { get; set; }

		public int EmployeeId { get; set; }
		public int ProjectId { get; set; }

		public virtual Employee Employee { get; set; }
		public virtual Project Project { get; set; }
	}
}
