using System.Data.Entity.Core.Objects;
using System.Web;
using System.Web.Mvc;

namespace Clewie {
    public class FilterConfig {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters) {
            filters.Add(new HandleErrorAttribute());
        }
    }
}
