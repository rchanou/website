var AWS = require("aws-sdk");
AWS.config.region = "us-west-2";
AWS.config.accessKeyId = process.env.snsKey;
AWS.config.secretAccessKey = process.env.snsSecret;

const Message = JSON.stringify({
  body: {
    "g-recaptcha-response": "invalid"
  }
});

exports.handler = function(event, context) {
  console.log("\n\nLoading handler\n\n");
  var sns = new AWS.SNS();

  sns.publish(
    {
      Message,//: "Test publish to SNS from Lambda",
      TopicArn: "arn:aws:sns:us-west-2:557935039423:UpdateSokoban"
    },
    function(err, data) {
      if (err) {
        console.log(err.stack);
        return;
      }
      console.log("push sent");
      console.log(data);
      context.done(null, "Function Finished!");
    }
  );
};
