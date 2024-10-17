const dbConnection = require("./connection");
const seed = require("./seeds/seed");
const testData = require("./data/test-data");

module.exports = { dbConnection, seed, testData };
