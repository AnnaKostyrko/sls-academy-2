const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function sortWordsAlphabetically(words) {
    return words.sort();
}

function sortNumbersAscending(numbers) {
    return numbers.sort((a, b) => a - b);
}

function sortNumbersDescending(numbers) {
    return numbers.sort((a, b) => b - a);
}

function sortByWordLength(words) {
    return words.sort((a, b) => a.length - b.length);
}

function showUniqueWords(words) {
    return [...new Set(words)];
}

function showUniqueValues(input) {
    return [...new Set(input)];
}

function handleUserInput(input) {
    const values = input.split(' ');

    rl.question(`How would you like to sort values: 
     1. Sort words alphabetically.
     2. Show numbers from lesser to greater.
     3. Show numbers from bigger to smaller.
     4. Display words in ascending order by number of letters in the word.
     5. Show only unique words.
     6. Display only unique values from the set of words and numbers entered by the user.
     If you want to exit, please, enter exit.
     
     Enter (1 - 6) and press ENTER: `, (operation) => {
        let result;

        switch (operation) {
            case '1':
                result = sortWordsAlphabetically(values.filter((word) => isNaN(word)));
                break;
            case '2':
                result = sortNumbersAscending(values.filter((num) => !isNaN(parseFloat(num))));
                break;
            case '3':
                result = sortNumbersDescending(values.filter((num) => !isNaN(parseFloat(num))));
                break;
            case '4':
                result = sortByWordLength(values.filter((word) => isNaN(word)));
                break;
            case '5':
                result = showUniqueWords(values.filter((word) => isNaN(word)));
                break;
            case '6':
                result = showUniqueValues(values);
                break;
            case 'exit':
                console.log('Goodbye! Come back again!');
                rl.close();
                return;
            default:
                console.log('Invalid operation. Please try again.');
        }

        if (result) {
            console.log(result.join(' '));
        }

        greeting(input);
    });
}

function greeting() {
    rl.question('Hello. Enter a few words or numbers separated by a space: ', (input) => {
        handleUserInput(input);
    });
}

greeting();
