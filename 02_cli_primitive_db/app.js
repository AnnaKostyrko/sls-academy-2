const inquirer = require('inquirer');
const fs = require('fs').promises;

const DP_PATH = 'database.txt';

async function createUser() {
    const userName = await inquirer.prompt([
        {
            name: 'name',
            message: "Enter the user's name. To cancel press Enter: ",
            type: "input",
        }
        ]);

    if (!userName.name) {
        await searchUser();
        return;
    }

    const userGenderAge = await inquirer.prompt([
        {
            name: 'gender',
            message: "Choose your gender: ",
            type: "list",
            choices: ["male", "female"]
        },
        {
            name: "age",
            message: "Enter your age: ",
            type: "number",
        }
    ]);

    const user = { ...userName, ...userGenderAge }

    await saveUser(user);
    await createUser();
}

async function saveUser(user) {
    const users = await getUsers();
    users.push(user)

    const data = JSON.stringify(users);
    await fs.writeFile(DP_PATH, data);
}

async function getUsers() {
    const fileContent = await fs.readFile(DP_PATH)
    return JSON.parse(fileContent.toString());
}

async function searchUser() {
    const askQuestion = await inquirer.prompt([
        {
            name: 'search',
            message: "Would you like to search users in DB?: ",
            type: "confirm",
        }
    ]);

    if (!askQuestion.search) {
        return;
    }

    const users = await getUsers();
    console.log(users);

    const input = await inquirer.prompt([
        {
            name: 'nameForSearch',
            message: "Enter user's name you wanna find in DB: ",
            type: "input",
        }
    ]);
    const searchPhrase = input.nameForSearch.toLowerCase();
    const foundUsers = users.filter(user => user.name.toLowerCase() === searchPhrase);
    if (foundUsers.length > 0) {
        console.log(`User ${input.nameForSearch} was found in the database.`);

        foundUsers.forEach(user => {
            console.log(user)
        });
    } else {
        console.log('User not found in the database.');
    }
}

createUser().catch(console.error);
