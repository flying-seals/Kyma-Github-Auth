const express = require("express");
const request = require("request");
const app = express();
const port = process.env.PORT || 8080;

app.use(express.static('assets'))
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/pages/landing.html");
});
app.get("/auth/redirect", (req, res) => {
  var options = {
    uri:
      "https://github.com/login/oauth/access_token?code=" +
      req.query.code +
      "&client_id=" +
      process.env.CLIENT_ID +
      "&client_secret=" +
      process.env.CLIENT_SECRET +
      "&redirect_uri=https://auth-github-connector.herokuapp.com/auth/redirect",
    method: "POST",
    headers: {
      Accept: "application/json"
    }
  };

  console.log(`options here: ${options.uri}`)

  request(options, (error, response, body) => {
    console.log(`body: ${body}`)
    var JSONresponse = JSON.parse(body);
    console.log(`JSON res: ${JSONresponse}`);

    console.log(JSONresponse);
    let token = JSONresponse.access_token;
    //let token = JSONresponse.bot.bot_access_token;

    let tokenPage = `
    <html lang="en">
    <head>
      <script src="https://cdn.jsdelivr.net/npm/clipboard@2/dist/clipboard.min.js"></script>
  
      <style></style>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <title>Github Connector</title>
  
      <style>
        html {
          height: 100%;
        }
        body {
          background-color: #24292e;
          height: 100%;
        }
        #container {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        h1,
        h2 {
          font-family: Poppins, sans-serif;
          color: white;
          text-align: center;
        }
        h3 {
          font-family: Poppins, sans-serif;
        }
      </style>
    </head>
  
    <body>
      <div id="container">
        <h1>Here's your bot token:</h1>
  
  
          <div id="token-placeholder" style="border: solid 1px white; padding: 10px; margin: 0 auto;"><h2>${token}</h2></div>
  
          <button class="btn" type="button" data-clipboard-target="#token-placeholder" style="background: transparent; border: 0px; margin-top: 10px;">
            <img src="/clippy.svg" width="35" style="fill: #ffffff;" alt="Copy to clipboard" />
          </button>
        </div>
  
      <script>
        var clipboard = new ClipboardJS(".btn");
        clipboard.on("success", function(e) {
          console.log(e);
        });
        clipboard.on("error", function(e) {
          console.log(e);
        });
      </script>
    </body>
  </html>
    `;
    res.status(200).send(tokenPage);
  }
  );
});
app.listen(port, () => console.log(`listening on http://localhost:${port}`));
