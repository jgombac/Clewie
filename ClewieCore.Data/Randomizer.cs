using System;

namespace ClewieCore.Data
{
    public static class Randomizer
    {
        private static Random mRandom = new Random();

        public static double RandomRange(double min, double max)
        {
            return mRandom.NextDouble() * (max - min) + min;
        }

        /// <summary>
        /// Creates an array of weight matrices with random values for a fully connected network.
        /// </summary>
        /// <param name="layers">Array with number of neurons in each layer</param>
        /// <returns>double[layers.Length-1][layers[i]][layers[i+1]]</returns>
        public static double[][][] RandomMatrices(int[] layers) {
            double[][][] result = new double[layers.Length - 1][][];
            for (int i = 0; i < result.Length; i++) { // iterate layers
                result[i] = new double[layers[i + 1]][]; // create next layer
                for (int j = 0; j < result[i].Length; j++) { //iterate next layer
                    result[i][j] = new double[layers[i]]; //create input weights
                    for (int k = 0; k < result[i][j].Length; k++) { // iterate input layer
                        result[i][j][k] = RandomRange(-1, 1);
                    }
                }
            }
            return result;
        }

        public static double[][][] Matrices(int[] layers, double val) {
            double[][][] result = new double[layers.Length - 1][][];
            for (int i = 0; i < result.Length; i++) { // iterate layers
                result[i] = new double[layers[i + 1]][]; // create next layer
                for (int j = 0; j < result[i].Length; j++) { //iterate next layer
                    result[i][j] = new double[layers[i]]; //create input weights
                    for (int k = 0; k < result[i][j].Length; k++) { // iterate input layer
                        result[i][j][k] = val;
                    }
                }
            }
            return result;
        }

        public static double[][] Biases(int[] layers, double val) {
            double[][] result = new double[layers.Length][];
            for (int i = 0; i < layers.Length; i++) {
                result[i] = new double[layers[i]];
                for (int j = 0; j < layers[i]; j++) {
                    result[i][j] = val;
                }
            }
            return result;
        }

        public static double[][][] EmptyMatrices(int[] layers) {
            double[][][] result = new double[layers.Length - 1][][];
            for (int i = 0; i < result.Length; i++) {
                result[i] = new double[layers[i]][];
                for (int j = 0; j < result[i].Length; j++) {
                    result[i][j] = new double[layers[i + 1]];
                }
            }
            return result;
        }

        public static double[][] RandomMatrix(int[] layers)
        {
            double[][] result = new double[layers.Length][];
            for(int i = 0; i < layers.Length; i++)
            {
                result[i] = new double[layers[i]];
                for (int j = 0; j < layers[i]; j++)
                {
                    result[i][j] = RandomRange(-1, 1);
                }
            }
            return result;
        }

        public static double[][] EmptyMatrix(int[] layers) {
            double[][] result = new double[layers.Length][];
            for (int i = 0; i < layers.Length; i++) {
                result[i] = new double[layers[i]];
            }
            return result;
        }

        public static double[][] RandomMatrix(int rows, int cols)
        {
            double[][] result = new double[rows][];
            for (int i = 0; i < rows; i++)
            {
                result[i] = new double[cols];
                for(int j = 0; j < cols; j++)
                {
                    result[i][j] = RandomRange(-1, 1);
                }
            }
            return result;
        }
    }
}
