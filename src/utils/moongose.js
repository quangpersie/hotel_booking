module.exports = {
    mutipleMoongoseToObject: (data) => {
        if (!data) {
            return [];
        }
        return data.map(data => data.toObject());
    },
    singleMoongoseToObject: (data) => {
        return data ? data.toObject() : data;
    },
    convertStringToDate: (str) => {
        try {
            let dateParts = str.split('-');
            return new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
        } catch (e) {
            return str
        }
    }
}