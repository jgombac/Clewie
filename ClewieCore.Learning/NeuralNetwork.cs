using ClewieCore.Data;
using System.Text;

namespace ClewieCore.Learning
{
    public class NeuralNetwork
    {
        private int[] layers;

        private double[][] weights;
        private double[][] biases;

        private double[] input;
        private double[] output;

        public NeuralNetwork(int[] layers) {
            this.layers = layers;
            InitWeights();
        }

        private void InitWeights()
        {
            weights = Randomizer.RandomMatrix(layers);
        }

        public double[][] GetWeights() {
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
