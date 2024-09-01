// Function to encode data using RLE
function encodeRLE(data) {
    let encoded = '';
    let count = 1;
    for (let i = 1; i < data.length; i++) {
        if (data[i] === data[i - 1]) {
            count++;
        } else {
            encoded += `${data[i - 1]}:${count},`;
            count = 1;
        }
    }
    encoded += `${data[data.length - 1]}:${count}`; // For the last run
    return encoded;
}

// Function to decode data using RLE
function decodeRLE(encodedData) {
    const decoded = [];
    const pairs = encodedData.split(',');
    for (const pair of pairs) {
        const [value, count] = pair.split(':').map(Number);
        for (let i = 0; i < count; i++) {
            decoded.push(value);
        }
    }
    return decoded;
}

export { encodeRLE, decodeRLE };
