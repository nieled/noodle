
/**
 * Module dependencies.
 */


var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , ejs = require('ejs');

var app = express();
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


app.get('/', routes.index);
app.get('/users', user.list);


var creds = require('./config');
var mturk  = require('./mturk')({creds: creds, sandbox: true});
var fs = require('fs');


var RegisterHITTypeOptions = { 
  Title: "Mturk Nodejs module RegisterHITType test"
  , Keywords: "keyword1, keyword2, keyword3" 
  , Description: "Test description"
  , Reward: {Amount: 1.0, CurrencyCode: "USD"}
  , AssignmentDurationInSeconds: 3600
  , AutoApprovalDelayInSeconds: 3600
  , QualificationRequirement: [mturk.QualificationRequirements.Adults]
};


// Step 1: First we have to create a HITTypeId
mturk.RegisterHITType(RegisterHITTypeOptions, function(err, HITTypeId){
  if (err) throw err;

  fs.readFile("./data/QuestionForm.xml", 'utf8', function(err, questionXML) {
    if (err) throw err;


    var CreateHITOptions = {
      'HITTypeId': HITTypeId
      , 'Question': questionXML
      , 'LifetimeInSeconds': 60 * 20  // How long should the assignment last?
      , 'MaxAssignments': 1
    };

    // Step 2: Now create the HIT itself.
    mturk.CreateHIT(CreateHITOptions, function(err, HITId){
      if (err) throw err;
      console.log("Created HIT "+HITId);
    });  // mturk.CreateHIT
  });
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});