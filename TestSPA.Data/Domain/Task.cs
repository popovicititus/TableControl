using System;
using System.Collections.Generic;

namespace TestSPA.Data
{
	public class Task : Entity
	{
		public string Name { get; set; }

		public int ProjectId { get; set; }
		public virtual Project Project { get; set; }
	}
}