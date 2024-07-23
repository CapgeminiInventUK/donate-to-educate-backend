#!/bin/bash
sleep 10

mongosh --host mongo1:27017 <<EOF
  var cfg = {
    "_id": "replicaSet",
    "version": 1,
    "members": [
      {
        "_id": 0,
        "host": "mongo1:27017",
        "priority": 2
      },
      {
        "_id": 1,
        "host": "mongo2:27017",
        "priority": 0
      },
      {
        "_id": 2,
        "host": "mongo3:27017",
        "priority": 0
      }
    ]
  };
  rs.initiate(cfg);
EOF

sleep 10

mongosh --host mongo1:27017 <<EOF
  use D2E;

  // Create collections
  db.createCollection("SchoolData");
  db.createCollection("CharityData");
  db.createCollection("CharityProfile");
  db.createCollection("CharityUser");
  db.createCollection("ItemQueries");
  db.createCollection("JoinRequests");
  db.createCollection("LocalAuthorityData");
  db.createCollection("LocalAuthorityRegisterRequests");
  db.createCollection("LocalAuthorityUser");
  db.createCollection("SchoolProfile");
  db.createCollection("SignUps");

  // Create indexes
  db.SchoolData.createIndex({location: '2dsphere'})
  db.CharityData.createIndex({location: '2dsphere'})
EOF

sleep 10

chmod +x /scripts/secrets.sh
source /scripts/secrets.sh

# Get data from the dev database
mongodump --uri "mongodb+srv://${USERNAME}:${PASSWORD}@donate-to-educate.oxzr0hm.mongodb.net/D2E" -o ./mongo-backup
mongorestore --uri "mongodb://mongo1:27017/" ./mongo-backup
