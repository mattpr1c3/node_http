const http = require("http");

const populateHTML = (headingContent) => {
  return `<main style="background-color: burlywood; height: 100vh; margin: 0; padding: 0; display: flex; justify-content: center; align-items: center;">
    <h1>${headingContent}</h1>
    </main>`;
};

http
  .createServer((req, res) => {
    const { url, method } = req;
    const chunks = [];
    req
      .on("error", (error) => {
        res.statusCode = 400;
        res.setHeader("Content-type", "application/json");
        res.write(JSON.stringify(error));
        res.end();
      })
      .on("data", (chunk) => {
        chunks.push(chunk);
      })
      .on("end", () => {
        const body = Buffer.concat(chunks).toString();
        const responseBody = {
          url,
          method,
          body,
        };
        res.on("error", (error) => {
          res.statusCode = 500;
          res.setHeader("Content-type", "application/json");
          res.write(JSON.stringify(error));
          res.end();
        });
        switch (url) {
          case "/":
            res.setHeader("Content-type", "text/html");
            res.write(populateHTML("Raise the Anthem, Burlywood."));
            break;
          case "/about":
            const details = {
              name: "Matt",
              city: "Tucson",
            };
            res.setHeader("Content-type", "application/json");
            res.write(JSON.stringify(details));
            break;
          case "/echo":
            res.setHeader("Content-type", "application/json");
            res.write(JSON.stringify(responseBody));
            break;
          default:
            res.setHeader("Content-type", "text/html");
            res.write(
              populateHTML(
                "404 Not Found. Try <a href='http://localhost:3000'>this</a>"
              )
            );
        }
        return res.end();
      });
  })
  .listen(3000, () => console.log("Server listening on port 3000..."));
