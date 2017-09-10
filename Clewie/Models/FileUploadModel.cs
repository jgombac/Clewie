using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Clewie.Models {
    public class FileUploadModel {

        public HttpPostedFileBase File { get; set; }
        public FileUploadParam Params { get; set; }
    }

    public class FileUploadParam {
        public string Decimal { get; set; }
        public string Column { get; set; }
    }
}