const fs = require('fs');
const tf = require('@tensorflow/tfjs-node');
const model = require('./model')


const BASE_PATH = "file:///home/dsn/personal/Tfjs/TensorFlowjs_Projects/mnist-classification/dataset/";
const TRAIN_DATA = `${BASE_PATH}train.csv`;
const IMAGE_WIDTH = 28
const IMAGE_HEIGHT = 28
const IMAGE_CHANNEL = 1
const IMAGE_SIZE = 784;
const NUM_CLASSES = 10;
const DATA_SIZE = 42000
const NUM_TRAIN_DATA = 38000
const NUM_TEST_DATA = DATA_SIZE - NUM_TRAIN_DATA

const TENSOR_DATA = []
const LABEL = []


async function loadData() {
    const csvDataset = tf.data.csv(TRAIN_DATA, {
        hasHeader: true,
        columnConfigs: {
            label: { isLabel: true }
        }
    });
    await csvDataset.forEachAsync(row => process(row));

}


async function process(row) {
    // TENSOR_DATA.push(tf.tensor((Object.values(row['xs'])), [IMAGE_HEIGHT, IMAGE_WIDTH, IMAGE_CHANNEL]).div(255))
    TENSOR_DATA.push(Object.values(row['xs']))
    LABEL.push(Object.values(row['ys'])[0])
}


exports.MnistClass = class MnistDataset {
    constructor() {
        this.Xtrain = null
        this.Xval = null
        this.ytrain = null
        this.ytest = null
    }

    async startDataLoading() {
        // dat = new MnistDataset()
        await loadData()
        this.Xtrain = tf.tensor(TENSOR_DATA.slice(0, NUM_TRAIN_DATA)).reshape([NUM_TRAIN_DATA, IMAGE_HEIGHT, IMAGE_WIDTH, IMAGE_CHANNEL]).div(255)
        this.Xtest = tf.tensor(TENSOR_DATA.slice(NUM_TRAIN_DATA)).reshape([NUM_TEST_DATA, IMAGE_HEIGHT, IMAGE_WIDTH, IMAGE_CHANNEL]).div(255)
        this.ytrain = tf.oneHot(tf.tensor1d(LABEL.slice(0, NUM_TRAIN_DATA), 'int32'), NUM_CLASSES);
        this.ytest = tf.oneHot(tf.tensor1d(LABEL.slice(NUM_TRAIN_DATA), 'int32'), NUM_CLASSES);
    }

}