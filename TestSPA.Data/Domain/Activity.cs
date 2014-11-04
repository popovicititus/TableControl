using System;
using System.Collections.Generic;

namespace TestSPA.Data
{
	public class Activity : Entity
	{
		public DateTime Date { get; set; }
		public string Notes { get; set; }
		public int Hours { get; set; }

		public int TaskId { get; set; }
		public int EmployeeId { get; set; }

		public virtual Task Task { get; set; }
		public virtual Employee Employee { get; set; }
	}
}
