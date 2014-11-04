using System;
using System.Data.Entity;
using System.Data.Entity.Migrations;
using System.Linq;

namespace TestSPA.Data.Migrations
{
	internal sealed class Configuration : DbMigrationsConfiguration<TestSPA.Data.DatabaseContext>
	{
		public Configuration()
		{
			this.AutomaticMigrationsEnabled = true;
		}

	}
}
