using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Diagnostics;
using System.Web;
using System.IO;
using ClewieCore.Models;

namespace ClewieCore.Data
{
    public class DataFactory {
        
        public string[][] ParsedDataset { get; set; }
        public double[][] NumerizedDataset { get; set; }
        public string[][] DataTypes { get; set; }

        public DataFactory(HttpPostedFileBase file) {
            ParsedDataset = FileRows(file);
        }

        public string[][] FileRows(HttpPostedFileBase file) {
            var rows = new List<string[]>();
            StreamReader reader = new StreamReader(file.InputStream);
            while(!reader.EndOfStream) {
                var line = reader.ReadLine();
                rows.Add(line.Split(';')); //TODO custom delimiter
            }
            return rows.ToArray();
        }

        public object NumerizeData(DataTypesModel dataRoles) {
            //key: index of nominal value, values: distinct nominal values
            Dictionary<int, string[]> nominals = new Dictionary<int, string[]>();
            //Calculate required length of new data array
            int dataCount = 0; 
            for (int i = 0; i < ParsedDataset[1].Length; i++) {
                //if data is numeric, it will only take one spot in array
                if (dataRoles.Types[i] == "numeric")
                    dataCount++;
                //if data is nominal we have to count how many distinct values there is in column
                else if (dataRoles.Types[i] == "nominal"){
                    List<string> distinctValues = new List<string>(); //Order is important
                    for (int x = 1; x < ParsedDataset.Length; x++) {
                        var currentVal = ParsedDataset[x][i];
                        if (!distinctValues.Any(val => val.Contains(currentVal)))
                            distinctValues.Add(currentVal);
                    }
                    nominals.Add(i, distinctValues.ToArray());
                    dataCount += distinctValues.Count;
                }
            }
            //init 2d array of doubles disregarding headers
            double[][] output = new double[ParsedDataset.Length-1][];
            for (int i = 1; i < ParsedDataset.Length; i++) {
                List<double> row = new List<double>(); 
                for (int j = 0; j < ParsedDataset[i].Length; j++) {
                    if (j == dataRoles.Target) //Leave target for the end of array
                        continue;
                    if (nominals.ContainsKey(j)) { //If value is of nominal type
                        int bitIndex = Array.IndexOf(nominals[j], ParsedDataset[i][j]); //find index of current value
                        for (int x = 0; x < nominals[j].Length; x++)
                            row.Add((x == bitIndex) ? 1 : 0); //turn on a bit where x == nominal value index
                    }
                    else { //if value is numeric simply add it to the row
                        row.Add(Double.Parse(ParsedDataset[i][j]));
                    }
                }

                //Add target to the end
                if (nominals.ContainsKey(dataRoles.Target)) { //If value is of nominal type
                    int bitIndex = Array.IndexOf(nominals[dataRoles.Target], ParsedDataset[i][dataRoles.Target]); //find index of current value
                    for (int x = 0; x < nominals[dataRoles.Target].Length; x++)
                        row.Add((x == bitIndex) ? 1 : 0); //turn on a bit where x == nominal value index
                }
                else { //if value is numeric simply add it to the row
                    row.Add(Double.Parse(ParsedDataset[i][dataRoles.Target]));
                }
                output[i - 1] = row.ToArray();
            }
            NumerizedDataset = output;
            int outputs = (nominals.ContainsKey(dataRoles.Target)) ? nominals[dataRoles.Target].Length : 1;
            int inputs = output[0].Length - outputs;
            return new { inputs = inputs, outputs = outputs, sample = NumerizedDataset[0] };
        }

        public Object DataSampleObject(int length) {
            var obj = new { headers = new object[ParsedDataset[0].Length], data = new string[length][] };
            for (int i = 0; i < ParsedDataset[0].Length; i++) {
                obj.headers[i] = new { title = ParsedDataset[0][i] };
            }
            for (int i = 1; i < ((length < ParsedDataset.Length) ? length : ParsedDataset.Length); i++) {
                obj.data[i - 1] = new string[ParsedDataset[i].Length];
                for (int j = 0; j < ParsedDataset[i].Length; j++)
                    obj.data[i - 1][j] = ParsedDataset[i][j];
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
            if (isNumeric) {
                sb.Append("<option value='0' " + ((isNumeric) ? "selected" : "") +">numeric</option>");
                sb.Append("<option value='1' " + ((!isNumeric) ? "selected" : "") + ">nominal</option>");
            }
            else
                sb.Append("<option value='0' " + ((!isNumeric) ? "selected" : "") + ">nominal</option>");
            sb.Append("</select>");
            return sb.ToString();
        }

        public string LogArray(double[][] arr, int length) {
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
