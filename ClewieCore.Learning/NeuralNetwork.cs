using ClewieCore.Data;
using System.Text;
using System.Linq;
using System;
using ClewieCore.Models;
using System.Collections.Generic;

namespace ClewieCore.Learning
{
    public class NeuralNetwork {

        private Layer[] layers;
        private double[] output;

        public NeuralNetwork(int[] layers) {
            this.layers = new Layer[layers.Length];
            for (int i = 0; i < layers.Length; i++) {
                this.layers[i] = new Layer((i == 0) ? 0 : layers[i - 1], layers[i]);
            }
        }

        public NeuralNetwork(TestCase test) {
            var layers = test.Layers;
            this.layers = new Layer[layers.Length];
            for (int i = 0; i < layers.Length; i++) {
                this.layers[i] = new Layer((i == 0) ? 0 : layers[i - 1], layers[i], test);
            }
        }

        public Layer this[int i] {
            get { return layers[i]; }
        }

        public double[] Compute(double[] input) {
            if (input.Length != layers[0].Outputs.Length)
                throw new Exception(string.Format("Unexpected input length: {0}, expected: {1}", input.Length, layers[0].Outputs.Length));
            output = input;
            for (int i = 0; i < layers.Length; i++) {
                output = layers[i].Compute(output);
                if (i == layers.Length - 1)
                    output = Softmax(output);
                else if (i > 0)
                    output = HyperTanFunction(output);
            }
            return output;
        }

        private static double[] HyperTanFunction(double[] values) {
            double[] result = new double[values.Length];
            for (int i = 0; i < values.Length; i++) {
                if (values[i] < -20.0) result[i] = -1.0;
                else if (values[i] > 20.0) result[i] = 1.0;
                else result[i] = Math.Tanh(values[i]);
            }
            return result;
        }

        private double[] Softmax(double[] values) {
            double max = values[0];
            for (int i = 0; i < values.Length; ++i)
                if (values[i] > max) max = values[i];
            double scale = 0.0;
            for (int i = 0; i < values.Length; ++i)
                scale += Math.Exp(values[i] - max);
            double[] result = new double[values.Length];
            for (int i = 0; i < values.Length; ++i)
                result[i] = Math.Exp(values[i] - max) / scale;
            return result;
        }
    }
}
