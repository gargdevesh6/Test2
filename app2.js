var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://test:Wipro123@ds147011.mlab.com:47011/testdb_";

MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
  //if (err) return console.log('conection_error');
  if (err) throw err;
  /*Return only the documents where the address starts with an "S":*/
  var db = client.db('testdb_');
  var item = { name: "Dada", description: "Papa ka papa" };
  db.collection("called-intents").insertOne(item, function(err, result) {
    if (err) console.log('not_found');
    console.log('inserted');
    client.close();
  });
}); 
