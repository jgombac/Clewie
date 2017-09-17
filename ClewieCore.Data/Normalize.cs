using System;

namespace ClewieCore.Data {
    public static class Normalize {

        public static double[][] MinMax(double[][] input, double min = 0, double max = 1) {
            //Initialize an empty 2d array
            var result = new double[input.Length][];
            for (int i = 0; i < input.Length; i++) {
                result[i] = new double[input[0].Length];
            }
            //Iterate trough columns
            for (int j = 0; j < input[0].Length; j++) {
                //Find min and max of the current column
                double colMax = Double.MinValue;
                double colMin = Double.MaxValue;
                for (int i = 0; i < input.Length; i++) {
                    var current = input[i][j];
                    if (current > colMax) colMax = current;
                    else if (current < colMin) colMin = current;
                }
                //Place every value in column to new range - default: [0, 1]
                for (int i = 0; i < input.Length; i++) {
                    result[i][j] = PlaceInRange(input[i][j], min, max, colMin, colMax);
                }
            }
            return result;
        }

        public static double PlaceInRange(double x, double min, double max, double colMin, double colMax) {
            return (x - colMin) * (max - min) / (colMax - colMin) + min;
        }

    }
}
