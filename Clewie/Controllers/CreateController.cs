
using Clewie.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ClewieCore.Data;

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
        public string TrainingSet() {
            var file = Request.Files[0];
            Debug.WriteLine(file.FileName);
            DataFactory df = new DataFactory(file);
            return df.ArrayToTable(df.ParsedDataset, 3);
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