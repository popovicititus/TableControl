using System.Web;
using System.Web.Optimization;

namespace TestSPA
{
	public class BundleConfig
	{
		public static void RegisterBundles(BundleCollection bundles)
		{
			bundles.Add(new StyleBundle("~/Content/css").Include(
				"~/Content/bootstrap/css/bootstrap.css",
				"~/Content/select2/select2.css",
				"~/Content/datepicker/datepicker3.css",
				"~/Content/site.css"
			));

			bundles.Add(new ScriptBundle("~/Bundles/jquery").Include("~/Scripts/jquery-{version}.js"));
			bundles.Add(new ScriptBundle("~/Bundles/bootstrap").Include("~/Content/bootstrap/js/bootstrap.js"));
			bundles.Add(new ScriptBundle("~/Bundles/angular").Include(
				"~/Content/angular/angular.js",
				"~/Content/angular/angular-route.js",
				"~/Content/angular/angular-sanitize.js"
			));
			bundles.Add(new ScriptBundle("~/Bundles/breeze").Include(
				"~/Scripts/q.js",
				"~/Scripts/breeze.debug.js"
			));
			bundles.Add(new ScriptBundle("~/Bundles/app").Include(
				"~/Content/select2/select2.js",
				"~/Content/datepicker/bootstrap-datepicker.js",
				//--
				"~/Scripts/app/app.js",
				"~/Scripts/app/services.js",
				"~/Scripts/app/controllers.js",
				"~/Scripts/app/filters.js",
				"~/Scripts/app/directives.js",
                "~/Scripts/app/functions.js",
                "~/Scripts/app/gridControl/gridControl.js"
			));
		}
	}
}