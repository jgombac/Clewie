using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClewieCore.Learning {
    class Tests {

        public void InitTests() {
            var layers = new int[] { 2, 3, 2 };
            NeuralNetwork nn = new NeuralNetwork(layers);
            double[] in1 = new double[] { 6, 4 };
            nn.ComputeOutputs(in1);
        }
    }
}
