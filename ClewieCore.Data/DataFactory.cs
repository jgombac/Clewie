using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Diagnostics;
using System.Web;
using System.IO;

namespace ClewieCore.Data
{
    public class DataFactory {
        
        public string[][] ParsedDataset { get; set; }

        public DataFactory(HttpPostedFileBase file) {
            ParsedDataset = FileRows(file);
        }

        public string[][] FileRows(HttpPostedFileBase file) {
            var rows = new List<string[]>();
            StreamReader reader = new StreamReader(file.InputStream);
            while(!reader.EndOfStream) {
                var line = reader.ReadLine();
                rows.Add(line.Split(','));
            }
            return rows.ToArray();
        }

        public string ArrayToTable(string[][] arr, int? length) {
            StringBuilder sb = new StringBuilder();
            sb.Append("<table class='rtable rtable--flip'>");
            //Header
            sb.Append("<thead>");
            sb.Append("<tr>");
            for (int i = 0; i < arr[0].Length; i++)
                sb.Append("<th>" + arr[0][i] + "</th>");
            sb.Append("</tr>");
            sb.Append("</thead>");
            //Body
            sb.Append("<tbody>");
            for (int i = 1; i < ((length < arr.Length) ? length : arr.Length); i++) {
                sb.Append("<tr>");
                for (int j = 0; j < arr[i].Length; j++)
                    sb.Append("<td>" + arr[i][j] + "</td>");
                sb.Append("</tr>");
            }

            //Data type select
            var options = new string[] { "numeric", "nominal" };
            sb.Append("<tr>");
            for (int i = 0; i < arr[0].Length; i++) {
                var attr = "data-gom-type='" + i + "'";
                sb.Append("<td>" + Dropdown(attr, options) + "</td>");
            }
            sb.Append("</tr>");

            sb.Append("</tbody>");
            sb.Append("</table>");
            return sb.ToString();
        }

        public string Dropdown(string attr, string[] options) {
            StringBuilder sb = new StringBuilder();
            sb.Append("<select " + attr + ">");
            for (int i = 0; i < options.Length; i++) {
                sb.Append("<option value='" + i + "'>" + options[i] + "</option>");
            }
            sb.Append("</select>");
            return sb.ToString();
        }

        public string LogArray(string[][] arr, int length) {
            StringBuilder sb = new StringBuilder();
            var range = (length < arr.Length) ? length : arr.Length;
            for (int i = 0; i < range; i++) {
                for (int j = 0; j < arr[i].Length; j++) {
                    sb.Append(arr[i][j] + "|");
                }
                sb.AppendLine();
            }
            return sb.ToString();
        }


    }
}
