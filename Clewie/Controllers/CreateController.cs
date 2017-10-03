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
        public JsonResult TestPrediction()
        {
            var test1 = new TestCase{
                Layers = new int[] { 2, 3, 2 },
                WeightValue = 0.5,
                BiasValue = 1,
                Input = new double[] { 6, 4 }
            };

            var test2 = new TestCase{
                Layers = new int[] { 3, 4, 3 },
                WeightValue = 0.6,
                BiasValue = 0.6,
                Input = new double[] { 8, 2, 4 }
            };

            var nn1 = new NeuralNetwork(test1);
            var nn2 = new NeuralNetwork(test2);

            return Json(new {
                test1 = test1,
                output1 = nn1.ComputeOutputs(test1.Input),
                test2 = test2,
                output2 = nn2.ComputeOutputs(test2.Input),
            });
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