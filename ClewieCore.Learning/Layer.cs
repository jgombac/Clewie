using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClewieCore.Learning {
    public class Layer {

        private int inputs;
        private Perceptron[] neurons;
        private double[] outputs;


        public Layer(int inputs, int neurons) {
            this.inputs = inputs;
            this.neurons = new Perceptron[neurons];
            for (int i = 0; i < neurons; i++) {
                this.neurons[i] = new Perceptron(inputs);
            }
            this.outputs = new double[neurons];
        }

        public Layer(int inputs, int neurons, TestCase test) {
            this.inputs = inputs;
            this.neurons = new Perceptron[neurons];
            for (int i = 0; i < neurons; i++) {
                this.neurons[i] = new Perceptron(inputs, test);
            }
            this.outputs = new double[neurons];
        }

        public int Inputs {
            get { return inputs; }
        }

        public Perceptron this[int i] {
            get { return neurons[i]; }
        }

        public double[] Outputs {
            get { return outputs; }
        }

        public double[] Compute(double[] input) {
            if (inputs == 0)
                return input;
            for (int i = 0; i < neurons.Length; i++) {
                outputs[i] = neurons[i].Compute(input);
            }
            return outputs;
        }
    }
}
