import fs from 'fs';
import wavDecoder from 'wav-decoder';
import { encodeRLE, decodeRLE } from './rle.js';

async function readWavFile(filePath) {
    const buffer = fs.readFileSync(filePath);
    const audioData = await wavDecoder.decode(buffer);
    return audioData;
}

function arraysAreEqual(arr1, arr2, tolerance = 1e-5) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (Math.abs(arr1[i] - arr2[i]) > tolerance) return false;
    }
    return true;
}

function saveCompressedData(fileName, compressedData) {
    fs.writeFileSync(fileName, compressedData);
}

function readCompressedData(fileName) {
    return fs.readFileSync(fileName, 'utf8');
}

function quantize(value, stepSize) {
    return Math.round(value / stepSize) * stepSize;
}

async function processAudio() {
    try {
        const filePath = '/Users/apple/Downloads/exampleaudio.wav';
        const audioData = await readWavFile(filePath);

        const stepSize = 0.0001;

        const channel1 = audioData.channelData[0].map(value => quantize(value, stepSize));
        const channel2 = audioData.channelData[1].map(value => quantize(value, stepSize));

        console.log('Original Quantized Channel 1 (first 10 values):', channel1.slice(0, 10));
        console.log('Original Quantized Channel 2 (first 10 values):', channel2.slice(0, 10));

        const encodedChannel1 = encodeRLE(channel1);
        const encodedChannel2 = encodeRLE(channel2);

        console.log('Encoded Channel 1:', encodedChannel1.slice(0, 100));
        console.log('Encoded Channel 2:', encodedChannel2.slice(0, 100));

        saveCompressedData('compressed_channel1.rle', encodedChannel1);
        saveCompressedData('compressed_channel2.rle', encodedChannel2);

        const encodedChannel1FromFile = readCompressedData('compressed_channel1.rle');
        const encodedChannel2FromFile = readCompressedData('compressed_channel2.rle');

        const decodedChannel1 = decodeRLE(encodedChannel1FromFile);
        const decodedChannel2 = decodeRLE(encodedChannel2FromFile);

        console.log('Decoded Quantized Channel 1 (first 10 values):', decodedChannel1.slice(0, 10));
        console.log('Decoded Quantized Channel 2 (first 10 values):', decodedChannel2.slice(0, 10));

        const isDecompressionSuccessful = arraysAreEqual(decodedChannel1, channel1) &&
                                          arraysAreEqual(decodedChannel2, channel2);

        console.log('Decompression Successful:', isDecompressionSuccessful);

        if (!isDecompressionSuccessful) {
            console.error('Mismatch found:');
            console.error('Original Channel 1:', channel1.slice(0, 10));
            console.error('Decoded Channel 1:', decodedChannel1.slice(0, 10));
            console.error('Original Channel 2:', channel2.slice(0, 10));
            console.error('Decoded Channel 2:', decodedChannel2.slice(0, 10));
        }

    } catch (error) {
        console.error('Error processing audio file:', error);
    }
}

processAudio();
