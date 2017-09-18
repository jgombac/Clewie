
namespace ClewieCore.Models
{
    public class NeuralNetworkParameters
    {
        public int[] Layers { get; set; }
        public int MaxEpochs { get; set; }
        public double LearningRate { get; set; }
        public double Momentum { get; set; }
        public double WeightDecay { get; set; }
    }
}
