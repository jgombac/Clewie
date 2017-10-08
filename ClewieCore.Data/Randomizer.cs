using System;

namespace ClewieCore.Data
{
    public static class Randomizer {
        private static Random mRandom = new Random();

        public static double RandomRange(double min, double max) {
            return mRandom.NextDouble() * (max - min) + min;
        }

        public static double[] RandomArray(int length) {
            double[] array = new double[length];
            for (int i = 0; i < array.Length; i++) {
                array[i] = RandomRange(-1, 1);
            }
            return array;
        }

        public static void ShuffleSequence(int[] sequence) {
            for (int i = 0; i < sequence.Length; ++i) {
                int r = mRandom.Next(i, sequence.Length);
                int tmp = sequence[r];
                sequence[r] = sequence[i];
                sequence[i] = tmp;
            }
        }
    }
}
