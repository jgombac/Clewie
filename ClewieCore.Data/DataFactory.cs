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
                rows.Add(line.Split(';'));
            }
            return rows.ToArray();
        }

        public Object ArrayToObject(string[][] arr, int length) {
            var obj = new { headers = new object[arr[0].Length], data = new string[length][] };
            for (int i = 0; i < arr[0].Length; i++) {
                obj.headers[i] = new { title = arr[0][i] };
            }
            for (int i = 1; i < ((length < arr.Length) ? length : arr.Length); i++) {
                obj.data[i - 1] = new string[arr[i].Length];
                for (int j = 0; j < arr[i].Length; j++)
                    obj.data[i - 1][j] = arr[i][j];
            }

            string[] selects = new string[obj.data[0].Length];
            for (int i = 0; i < selects.Length; i++) {
                var attr = "data-gom-type='" + i + "'";
                selects[i] = DataTypeSelect(attr, obj.data[0][i]);
            }
            obj.data[obj.data.Length-1] = selects;
            return obj;
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
            sb.Append("<tr>");
            for (int i = 0; i < arr[1].Length; i++) {
                var attr = "data-gom-type='" + i + "'";
                sb.Append("<td>" + DataTypeSelect(attr, arr[1][i]) + "</td>");
            }
            sb.Append("</tr>");

            sb.Append("</tbody>");
            sb.Append("</table>");
            return sb.ToString();
        }

        public string DataTypeSelect(string attr, string value) {
            StringBuilder sb = new StringBuilder();
            double result = Double.NaN;
            var isNumeric = Double.TryParse(value, out result);
            Debug.WriteLine(value + " " + isNumeric.ToString());
            sb.Append("<select " + attr + ">");
            sb.Append("<option value='0' " + ((isNumeric) ? "selected" : "") +">numeric</option>");
            sb.Append("<option value='1' " + ((!isNumeric) ? "selected" : "") + ">nominal</option>");
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
