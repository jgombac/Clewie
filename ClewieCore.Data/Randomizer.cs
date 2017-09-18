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
