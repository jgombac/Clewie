using System.Diagnostics;
using System.Web.Mvc;
using ClewieCore.Data;
using ClewieCore.Models;
using ClewieCore.Learning;
using System;
using System.Linq;
using System.Configuration;
using System.Data.SqlClient;

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

        [HttpGet]
        [Route("Create/GenerateID")]
        public JsonResult GenerateID()
        {
            return Json(Guid.NewGuid().ToString(), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [Route("Create/TrainingSet")]
        public JsonResult TrainingSet()
        {
            var file = Request.Files[0];
            Debug.WriteLine(file.FileName);
            DataFactory df = new DataFactory(file);
            Session["dataFactory"] = df;
            return Json(df.DataSampleObject(2));
        }

        [HttpPost]
        [Route("Create/UpdateDataRoles")]
        public JsonResult UpdateDataRoles(DataTypesModel model)
        {
            DataFactory df = Session["dataFactory"] as DataFactory;
            var fixedStructure = df.NumerizeData(model);
            return Json(fixedStructure);
        }

        [HttpPost]
        [Route("Create/UploadParameters")]
        public JsonResult UploadParameters(NeuralNetworkModel model)
        {
            var nn = new NeuralNetwork(model.Layers);
            Session["neuralNetwork"] = nn;

            return Json(new { });
        }

        [HttpPost]
        [Route("Create/Pretrain")]
        public JsonResult Pretrain(NeuralNetworkModel model)
        {
            NeuralNetwork nn = new NeuralNetwork(model.Layers);
            DataFactory df = Session["dataFactory"] as DataFactory;
            var learningParams = model.Parameters;
            BackPropagation backProp = new BackPropagation(nn, learningParams);
            var predictions = backProp.Train(df.NumerizedDataset);
            return Json(new { predictions = predictions });
        }

        [HttpPost]
        [Route("Create/TestPrediction")]
        public JsonResult TestPrediction(TestCase model)
        {
            try
            {
                return Json(new
                {
                    testCase = model,
                    output = new NeuralNetwork(model).Compute(model.Input),
                });
            }
            catch (Exception ex)
            {
                return Json(ex.Message);
            }
        }

        [HttpPost]
        [Route("Create/Publish")]
        public JsonResult Publish(NeuralNetworkModel model)
        {
            NeuralNetwork nn = new NeuralNetwork(model.Layers);
            var serialized = nn.Serialize();
            NeuralNetwork deserialized = Serializer.Deserialize<NeuralNetwork>(serialized);

            try
            {
                string constr = ConfigurationManager.ConnectionStrings["ClewieDB"].ConnectionString; 
                SqlConnection con = new SqlConnection(constr);
                con.Open();
                string query = "INSERT INTO NeuralNetworks(MODEL_ID, MODEL_NAME, MODEL_DESCRIPTION, MODEL_SERIALIZATION) VALUES(@MODEL_ID, @MODEL_NAME, @MODEL_DESCRIPTION, @MODEL_SERIALIZATION)";
                SqlCommand cmd = new SqlCommand(query, con);
                cmd.Parameters.AddWithValue("@MODEL_ID", model.Id);
                cmd.Parameters.AddWithValue("@MODEL_NAME", model.Name);
                cmd.Parameters.AddWithValue("@MODEL_DESCRIPTION", model.Description);
                cmd.Parameters.AddWithValue("@MODEL_SERIALIZATION", serialized);
                cmd.ExecuteNonQuery();
                con.Close();
                return Json("succes saving");
            }
            catch (Exception ex)
            {
                return Json(ex.Message);
            }
        }
    }
}