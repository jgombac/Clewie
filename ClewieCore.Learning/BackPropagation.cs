using ClewieCore.Data;
using ClewieCore.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClewieCore.Learning {
    public class BackPropagation {

        private NeuralNetwork nn;
        private int maxEpochs;
        private double learningRate;
        private double momentum;
        private double weightDecay;



        public BackPropagation(NeuralNetwork nn, NeuralNetworkParameters parameters) {
            this.nn = nn;
            this.maxEpochs = parameters.MaxEpochs;
            this.learningRate = parameters.LearningRate;
            this.momentum = parameters.Momentum;
            this.weightDecay = parameters.WeightDecay;
        }


        public double[][] Train(double[][] dataset) {
            double[] input = new double[nn.NumInputs]; // inputs
            double[] output = new double[nn.NumOutputs]; // target values

            int[] sequence = new int[dataset.Length];
            for (int i = 0; i < sequence.Length; ++i)
                sequence[i] = i;

            double[][] predictions = new double[maxEpochs][];
            int epoch = 0;
            while (epoch < maxEpochs) {
                Randomizer.ShuffleSequence(sequence);
                for (int i = 0; i < dataset.Length; i++) {
                    Array.Copy(dataset[i], input, nn.NumInputs);
                    Array.Copy(dataset[i], nn.NumInputs, output, 0, nn.NumOutputs);
                    double[] prediction = nn.Compute(input);
                    if (i == dataset.Length - 1)
                        predictions[epoch] = prediction;
                }
                epoch++;
            }
            return predictions;
        }
    }
}
