var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://test:Wipro123@ds147011.mlab.com:47011/testdb_";

MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
  //if (err) return console.log('conection_error');
  if (err) throw err;
  /*Return only the documents where the address starts with an "S":*/
  var db = client.db('testdb_');
  var query = { name: "Dada" };
  db.collection("called-intents").find(query).toArray(function(err, result) {
    if (err) console.log('not_found');
    console.log(result);
    client.close();
  });
}); 
