using System.Web.Http;

[assembly: WebActivator.PreApplicationStartMethod(typeof(TestSPA.BreezeWebApiConfig), "RegisterBreezePreStart")]
namespace TestSPA
{
	public static class BreezeWebApiConfig
	{
		public static void RegisterBreezePreStart()
		{
			GlobalConfiguration.Configuration.Routes.MapHttpRoute(
					name: "BreezeApi",
					routeTemplate: "breeze/{controller}/{action}"
			);
		}
	}
}