using ClewieCore.Data;
using System;

namespace ClewieCore.Learning {

    [Serializable]
    public class Perceptron {

        private double[] weights;
        private double bias;
        private double output;


        public Perceptron(int inputs) {
            weights = Randomizer.RandomArray(inputs);
            bias = 1;
        }

        public Perceptron(int inputs, TestCase test) {
            weights = new double[inputs];
            for (int i = 0; i < inputs; i++) {
                weights[i] = test.WeightValue;
            }
            bias = test.BiasValue;
        }

        public double this[int i] {
            get { return weights[i]; }
            set { weights[i] = value; }
        }

        public double Bias {
            get { return bias; }
        }

        public double Output {
            get { return output; }
        }

        public double Compute(double[] input) {
            double sum = 0.0;
            for (int i = 0; i < weights.Length; i++) {
                sum += weights[i] * input[i];
            }
            return sum + bias;
        }

    }
}
