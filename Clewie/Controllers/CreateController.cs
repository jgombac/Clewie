using System.Diagnostics;
using System.Web.Mvc;
using ClewieCore.Data;
using ClewieCore.Models;
using ClewieCore.Learning;

namespace Clewie.Controllers
{
    public class CreateController : Controller
    {
        // GET: Create
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [Route("Create/{modelName}")]
        public ActionResult Model(string modelName)
        {
            return View("Models/" + modelName);
        }

        [HttpPost]
        [Route("Create/TrainingSet")]
        public JsonResult TrainingSet() {
            var file = Request.Files[0];
            Debug.WriteLine(file.FileName);
            DataFactory df = new DataFactory(file);
            Session["dataFactory"] = df;
            return Json(df.DataSampleObject(2));
        }

        [HttpPost]
        [Route("Create/UpdateDataRoles")]
        public string UpdateDataRoles(DataTypesModel model) {
            DataFactory df = Session["dataFactory"] as DataFactory;
            var numerized = df.NumerizeData(model);
            return df.LogArray(numerized, 5) + "\n" + df.LogArray(Normalize.MinMax(numerized), 5);
        }

        [HttpPost]
        [Route("Create/UploadParameters")]
        public string UploadParameters (NeuralNetworkParameters model)
        {
            Debug.WriteLine(model.Layers.ToString());
            var layers = model.Layers;
            var nn = new NeuralNetwork(layers);
            return nn.WeightsToString();
        }

        //[HttpPost]
        //[Route("Publish/{id}")]
        //public ActionResult Publish(string id, APIModel model)
        //{
        //    Debug.WriteLine(id);
        //    Debug.WriteLine(model.Id);
        //    return RedirectToAction("Browse", "Model");
        //}

    }
}