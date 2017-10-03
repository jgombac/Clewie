using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace Clewie.Controllers
{
    public class JsTemplatesController : Controller
    {
        // GET: JsTemplates
        public FileContentResult GetJsTemplates()
        {
            string tempObj = string.Empty;
            StringBuilder sb = new StringBuilder();

            sb.AppendLine(RenderTemplate("TrainingDatasetDesigner", "TrainingDatasetDesigner"));
            sb.AppendLine(RenderTemplate("SandboxModal", "SandboxModal"));

            tempObj = sb.ToString();

            return File(Encoding.UTF8.GetBytes(tempObj), "text/javascript");
        }

        private string RenderTemplate(string templateName, string partialName)
        {
            return this.RenderTemplate(templateName, partialName, null);
        }

        private string RenderTemplate(string templateName, string partialName, object m)
        {
            return string.Format("$.templates({0},{1});", System.Web.Helpers.Json.Encode(templateName), System.Web.Helpers.Json.Encode(RenderPartialViewToString(partialName, m)));
        }

        protected string RenderPartialViewToString(string viewName, object model)
        {
            if (string.IsNullOrEmpty(viewName))
                viewName = ControllerContext.RouteData.GetRequiredString("action");

            ViewData.Model = model;

            using (StringWriter sw = new StringWriter())
            {
                ViewEngineResult viewResult = ViewEngines.Engines.FindPartialView(ControllerContext, viewName);
                ViewContext viewContext = new ViewContext(ControllerContext, viewResult.View, ViewData, TempData, sw);
                viewResult.View.Render(viewContext, sw);

                return sw.ToString();
            }
        }
    }
}