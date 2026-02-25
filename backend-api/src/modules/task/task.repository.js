const config = require('../../config');

let repository;

if (config.storageType === 'mongodb') {
  repository = require('./task.repository.mongo');
} else {
  repository = require('./task.repository.memory');
}

module.exports = repository;
