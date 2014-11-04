using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using TestSPA.Data.Migrations;

namespace TestSPA.Data
{
    public static class DatabaseConfiguration
    {
        public static void InitDatabase()
        {
            Database.SetInitializer(new MigrateDatabaseToLatestVersion<DatabaseContext, Configuration>());
            new DatabaseContext().Database.Initialize(false);

            using (var context = new DatabaseContext())
            {
                if (!context.Activities.Any())
                {
                    Seed(context);
                }
            }
        }

        public static void Seed(TestSPA.Data.DatabaseContext context)
        {
            context.Configuration.AutoDetectChangesEnabled = false;

            SeedEmployees(context);
            SeedCustomers(context);
            SeedProjects(context);

            context.Configuration.AutoDetectChangesEnabled = true;
        }


        private static void SeedEmployees(DatabaseContext context)
        {
            for (int i = 0; i < 111; i++)
            {
                context.Employees.Add(new Employee
                {
                    UserName = "domain\\username" + i,
                    FirstName = "first",
                    LastName = "last " + i,
                });
            }
        }

        private static void SeedCustomers(DatabaseContext context)
        {
            for (int i = 0; i < 5555; i++)
            {
                context.Customers.Add(new Customer
                {
                    Name = "shiny customer " + i,
                    Description = "some description of the shiny customer " + i + " that work with happy people of accesa"
                });
            }
        }

        private static void SeedProjects(DatabaseContext context)
        {
            Random rand = new Random();

            var customers = context.Customers.Local.ToList();
            for (int i = 0; i < 555; i++)
            {
                DateTime projFrom = new DateTime(2010 + rand.Next(3), rand.Next(1, 13), rand.Next(1, 29));
                DateTime projTo = projFrom.AddDays(30 + rand.Next(200));

                Project project = new Project
                {
                    Name = "project " + i,
                    From = projFrom,
                    To = projTo,
                    Customer = customers[rand.Next(0, customers.Count)],
                    Status = rand.Next(0, 4),
                    Description = "some description of the wonderful project " + i + " implemeted by happy people of accesa",
                };
                context.Projects.Add(project);

                // add some tasks
                for (int j = 0; j < 55; j++)
                {
                    Task task = new Task
                    {
                        Project = project,
                        Name = string.Format("task {0} for {1}", j, project.Name)
                    };
                    context.Tasks.Add(task);
                }

                // asign some employees
                int e = rand.Next(1, 10);
                Employee[] employees = context.Employees.Local.ToArray();
                for (int j = 0; j < e; j++)
                {
                    DateTime linkFrom = project.From.AddDays(rand.Next((int)(project.To - project.From).TotalDays / 2));
                    DateTime linkTo = linkFrom.AddDays(rand.Next((int)(project.To - project.From).TotalDays / 2));
                    EmployeeProjectLink link = new EmployeeProjectLink
                    {
                        Project = project,
                        Employee = employees[rand.Next(employees.Length)],
                        From = linkFrom,
                        To = linkTo
                    };
                    context.EmployeeProjectLinks.Add(link);

                    // add some activities
                    int a = rand.Next(100, 200);
                    Task[] tasks = project.Tasks.ToArray();
                    for (int k = 0; k < a; k++)
                    {
                        Task task = (Task)tasks.GetValue(rand.Next(tasks.Length));
                        Activity activity = new Activity
                        {
                            Employee = link.Employee,
                            Task = task,
                            Date = project.From.AddDays(rand.Next((int)(project.To - project.From).TotalDays)),
                            Hours = rand.Next(1, 9),
                            Notes = string.Format("just some notes about the activity for the task {0}", task.Name)
                        };
                        context.Activities.Add(activity);
                    }
                }

                context.SaveChanges();
            }
        }
    }
}
