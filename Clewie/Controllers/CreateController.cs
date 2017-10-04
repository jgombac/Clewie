using System.Diagnostics;
using System.Web.Mvc;
using ClewieCore.Data;
using ClewieCore.Models;
using ClewieCore.Learning;
using System;

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
        public JsonResult UpdateDataRoles(DataTypesModel model) {
            DataFactory df = Session["dataFactory"] as DataFactory;
            var fixedStructure = df.NumerizeData(model);
            return Json(fixedStructure);
        }

        [HttpPost]
        [Route("Create/UploadParameters")]
        public string UploadParameters (NeuralNetworkParameters model)
        {
            var nn = new NeuralNetwork(model.Layers);
            return nn.WeightsToString();
        }

        [HttpPost]
        [Route("Create/TestPrediction")]
        public JsonResult TestPrediction(TestCase model)
        {
            try { 
                return Json(new {
                    testCase = model,
                    output = new NeuralNetwork(model).ComputeOutputs(model.Input),
                });
            }
            catch (Exception ex) {
                return Json(ex.Message);
            }
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