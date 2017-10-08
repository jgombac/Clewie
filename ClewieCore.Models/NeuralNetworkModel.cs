using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClewieCore.Models {
    public class NeuralNetworkModel {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        public string[] Inputs { get; set; }
        public string[] Outputs { get; set; }
        public int[] Layers { get; set; }

        public NeuralNetworkParameters Parameters { get; set; }
    }

    public class NeuralNetworkParameters {
        public int MaxEpochs { get; set; }
        public double LearningRate { get; set; }
        public double Momentum { get; set; }
        public double WeightDecay { get; set; }
    }
}
