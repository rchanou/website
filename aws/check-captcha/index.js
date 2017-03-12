const request = require("request");

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Headers": "Accept,Content-Type,Access-Control-Allow-Origin",
  "Access-Control-Allow-Origin": "*"
};

exports.handler = (event, context, callback) => {
  const handleResponse = (err, res, body) => {
    const bodyData = JSON.parse(body);
    console.log('body', bodyData);
    if (err || !bodyData.success) {
      callback(null, {
        statusCode: "401",
        body,
        headers
      });
      return;
    }

    callback(null, {
      statusCode: "200",
      body,//: event.body,
      headers
    });
  };

  const bodyData = JSON.parse(event.body);

  const captchaFormData = {
    secret: process.env.recaptchaSecret,
    response: bodyData["g-recaptcha-response"]
  };

  //console.log("cap", captchaFormData);

  request.post(
    " https://www.google.com/recaptcha/api/siteverify",
    { Accept: 'application/json', form: captchaFormData },
    handleResponse
  );
};
