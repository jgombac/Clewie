using ClewieCore.Data;
using System.Text;
using System.Linq;
using System;

namespace ClewieCore.Learning
{
    public class NeuralNetwork
    {
        private int[] layers;

        private double[][] neurons;

        private double[][][] weights;
        private double[][] biases;

        //back-propagation
        private double[][] gradients;
        private double[][][] prevWeightsDelta;
        private double[][] prevBiasesDelta;

        public NeuralNetwork(int[] layers) {
            this.layers = layers;
            InitNetwork();
        }

        private void InitNetwork()
        {
            //Only weights and biases need to have a starting value, others can be empty
            neurons = Randomizer.EmptyMatrix(layers);
            //weights = Randomizer.RandomMatrices(layers);
            //biases = Randomizer.RandomMatrix(layers.Skip(1).ToArray());

            weights = Randomizer.Matrices(layers, 0.5);
            biases = Randomizer.Biases(layers.Skip(1).ToArray(), 1);

            gradients = Randomizer.EmptyMatrix(layers.Skip(1).ToArray());
            prevWeightsDelta = Randomizer.EmptyMatrices(layers);
            prevBiasesDelta = Randomizer.EmptyMatrix(layers.Skip(1).ToArray());
        }


        public double[] ComputeOutputs(double[] inputs) {
            if (inputs.Length != neurons[0].Length)
                throw new Exception(String.Format("Bad input length: {0}, expected: {1}", inputs.Length, neurons[0].Length));

            for (int i = 0; i < neurons[0].Length; i++) //Copy inputs to neurons
                neurons[0][i] = inputs[i];

            for (int i = 1; i < neurons.Length; i++) {
                double[] weightedSums = new double[neurons[i].Length];
                for (int j = 0; j < weightedSums.Length; j++) {
                    for (int k = 0; k < neurons[i - 1].Length; k++) {
                        weightedSums[j] += neurons[i - 1][k] * weights[i - 1][j][k];
                    }
                    weightedSums[j] += biases[i - 1][j]; // add bias
                    if (i <= neurons.Length - 2) { //apply only to hidden layers
                        neurons[i][j] = HyperTanFunction(weightedSums[j]);
                    }
                    else if (i == neurons.Length - 1 && j == weightedSums.Length - 1) { //apply only to output layer
                        double[] softOut = SoftMax(weightedSums);
                        Array.Copy(softOut, neurons[i], softOut.Length);
                        double[] result = new double[neurons[i].Length];
                        Array.Copy(neurons[i], result, result.Length);
                        return result;
                    }
                }
            }

            return null;
        }


        private double HyperTanFunction(double x) {
            if (x < -20.0) return -1.0; // approximation is correct to 30 decimals
            else if (x > 20.0) return 1.0;
            else return Math.Tanh(x);
        }

        private double[] SoftMax(double[] outputs) {
            // determine max output sum
            // does all output nodes at once so scale doesn't have to be re-computed each time
            double max = outputs[0];
            for (int i = 0; i < outputs.Length; ++i)
                if (outputs[i] > max) max = outputs[i];

            // determine scaling factor -- sum of exp(each val - max)
            double scale = 0.0;
            for (int i = 0; i < outputs.Length; ++i)
                scale += Math.Exp(outputs[i] - max);

            double[] result = new double[outputs.Length];
            for (int i = 0; i < outputs.Length; ++i)
                result[i] = Math.Exp(outputs[i] - max) / scale;

            return result; // now scaled so that xi sum to 1.0
        }


        public double[][][] GetWeights() {
            return weights;
        }

        public string WeightsToString()
        {
            StringBuilder sb = new StringBuilder();
            for(int i = 0; i < weights.Length; i++)
            {
                sb.Append("|");
                for (int j = 0; j < weights[i].Length; j++)
                {
                    sb.Append(weights[i][j] + "|");
                }
                sb.AppendLine();
            }
            return sb.ToString();
        }
    }
}
