using System;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.ModelConfiguration.Conventions;

namespace TestSPA.Data
{
	public class DatabaseContext : DbContext
	{
		public virtual DbSet<Employee> Employees { get; set; }
		public virtual DbSet<Customer> Customers { get; set; }
		public virtual DbSet<Project> Projects { get; set; }
		public virtual DbSet<Task> Tasks { get; set; }
		public virtual DbSet<EmployeeProjectLink> EmployeeProjectLinks { get; set; }
		public virtual DbSet<Activity> Activities { get; set; }

	
		public DatabaseContext()
			: base("name=DatabaseContext")
		{
		}


		protected override void OnModelCreating(DbModelBuilder modelBuilder)
		{
			// remove unwanted conventions
			modelBuilder.Conventions.Remove<OneToManyCascadeDeleteConvention>();
			modelBuilder.Conventions.Remove<NavigationPropertyNameForeignKeyDiscoveryConvention>();

			// add entities configuration

		}
	}
}