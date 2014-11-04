using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using TestSPA.Models;

namespace TestSPA.Controllers
{
	public class HomeController : Controller
	{
		public ActionResult Index()
		{
			HomeModel model = new HomeModel();
			model.Title = "SPA";

			return View(model);
		}
	}
}