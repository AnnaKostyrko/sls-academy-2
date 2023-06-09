const fs = require('fs').promises;

async function readFiles (fileName) {
    const response = await fs.readFile(fileName);
    return response.toString().split('\n');
}

let dictionary = null;

async function init() {
    const values = new Map();

    for (let i = 0; i <= 19; i++) {
        const fileName = `./2kk_words_400x400/out${i}.txt`;
        const words = await readFiles(fileName);

        let uniqueValuesInEachFile = new Set(words);

        for (let word of uniqueValuesInEachFile) {
            if (!values.has(word)) {
                values.set(word, 1);
            } else {
                values.set(word, values.get(word)+1);
            }
        }
    }
    return values;
}

async function uniqueValues() {
    if (dictionary === null) {
        dictionary = await init();
    }
    return dictionary.size;
}

async function existInAllFiles() {
    if (dictionary === null) {
        dictionary = await init();
    }
    let count = 0;

    for (let value of dictionary.values()) {
        if (value === 20) {
            count++;
        }
    }
    return count;
}

async function existInAtLeastTen() {
    if (dictionary === null) {
        dictionary = await init();
    }
    let count = 0;

    for (let value of dictionary.values()) {
        if (value >= 10) {
            count++;
        }
    }
    return count;
}

( async () => {
        console.time('Elapsed Time');
        dictionary = await init();
        const response = await Promise.all( [uniqueValues(), existInAllFiles(), existInAtLeastTen()]);
        console.log(response.join(', '));
        console.timeEnd('Elapsed Time');
    }
)().catch(console.error);
