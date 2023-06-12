const fs = require('fs').promises;

function reformatJson(originalJson) {
    const map = new Map();
    originalJson.map(infoUser => {
        if (!map.has(infoUser._id)) {
            map.set(infoUser._id, {
                userId: infoUser.user._id,
                userName: infoUser.user.name,
                vacations: []
            });
        }
        map.get(infoUser._id).vacations.push({
            startDate: infoUser.startDate,
            endDate: infoUser.endDate
        });
    });

    return JSON.stringify([...map.values()])
}

( async () => {
    const fileData = await fs.readFile('./vacations.json');
    const originalJson = JSON.parse(fileData.toString());
    console.log(reformatJson(originalJson))
})();
