using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClewieCore.Learning
{
    public class NeuralNetwork
    {
        private int numInput;
        private int[] numHidden;
        private int numOutput;

        public NeuralNetwork(int numInput, int[] numHidden, int numOutput) {
            this.numInput = numInput;
            this.numHidden = numHidden;
            this.numOutput = numOutput;
        }
    }
}
