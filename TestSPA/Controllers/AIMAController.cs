using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Management;
using System.Web.Mvc;
using Breeze.WebApi2;
using Breeze.ContextProvider.EF6;

using TestSPA.Data;
using Breeze.ContextProvider;
using Newtonsoft.Json.Linq;

namespace TestSPA.Controllers
{
	[BreezeController]
	public class AIMAController : ApiController
	{
		private readonly EFContextProvider<DatabaseContext> contextProvider = new EFContextProvider<DatabaseContext>();

		// ~/breeze/aima/Metadata
		[System.Web.Http.HttpGet]
		public string Metadata()
		{
			return this.contextProvider.Metadata();
		}

		// ~/breeze/aima/Projects
		[System.Web.Http.HttpGet]
		public IQueryable<Project> Projects()
		{
			System.Threading.Thread.Sleep(500);
			return this.contextProvider.Context.Projects.Include("Customer");
		}

		// ~/breeze/aima/Customers
		[System.Web.Http.HttpGet]
		public IQueryable<Customer> Customers()
		{
			//System.Threading.Thread.Sleep(500);
			return this.contextProvider.Context.Customers;
		}

		// ~/breeze/aima/SaveChanges
		[System.Web.Http.HttpPost]
		public SaveResult SaveChanges(JObject saveBundle)
		{
			return this.contextProvider.SaveChanges(saveBundle);
		}
	}
}