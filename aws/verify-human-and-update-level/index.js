const request = require("request");
const doc = require("dynamodb-doc");

const dynamo = new doc.DynamoDB();

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Headers": "Accept,Content-Type,Access-Control-Allow-Origin",
  "Access-Control-Allow-Origin": "*"
};

exports.handler = (event, context, callback) => {
  const bodyData = JSON.parse(event.body);

  const handleResponse = (err, res, captchaResponseBody) => {
    const captchaResponseBodyData = JSON.parse(captchaResponseBody);
    if (err || !captchaResponseBodyData.success) {
      callback(null, {
        statusCode: "401",
        captchaResponseBody,
        headers
      });
      return;
    }

    const handleDynamo = (err, dynamoRes) => callback(null, {
      statusCode: err ? "400" : "200",
      body: JSON.stringify(err ? { message: err.message } : dynamoRes),
      headers
    });

    switch (event.httpMethod) {
      case "DELETE":
        dynamo.deleteItem(bodyData.doc, handleDynamo);
        break;
      case "POST":
        const params = {
          TableName: 'SokobanLevels',
          Item: bodyData.doc
        }

        dynamo.putItem(params, handleDynamo);
        break;
      case "PUT":
        dynamo.updateItem(bodyData.doc, handleDynamo);
        break;
      default:
        handleDynamo(new Error(`Unsupported method "${event.httpMethod}"`));
    }
  };

  if (!bodyData["g-recaptcha-response"]) {
    callback(null, {
      statusCode: "401",
      body: JSON.stringify({ message: "Captcha required." }),
      headers
    });
  }

  const captchaFormData = {
    secret: process.env.recaptchaSecret,
    response: bodyData["g-recaptcha-response"]
  };

  request.post(
    " https://www.google.com/recaptcha/api/siteverify",
    { Accept: "application/json", form: captchaFormData },
    handleResponse
  );
};
