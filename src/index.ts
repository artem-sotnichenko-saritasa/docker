const HEADERS_MAP: Record<string, Record<string, string>> = {
  json: {
    "content-type": "application/json",
  },
  html: {
    "content-type": "text/html",
  },
  csv: {
    "content-type": "text/html",
    "content-disposition": "attachment;filename=oceanpals.csv",
  },
};

/**
 * Encapsulates respond logic.
 * @param requestEvent Deno request event.
 * @param type Content type.
 * @param body Response body.
 */
function respond(
  requestEvent: Deno.RequestEvent,
  type: "json" | "html" | "csv" | "text",
  body: string,
) {
  requestEvent.respondWith(
    new Response(body, {
      headers: HEADERS_MAP[type] ?? {},
      status: 200,
    }),
  );
}

const BOOKS_MOCK = JSON.stringify([
  { title: "The Alchemist", author: "Paulo Coelho", year: 1988 },
  { title: "The Prophet", author: "Kahlil Gibran", year: 1923 },
]);

const server = Deno.listen({ port: 8080 });
console.log(`HTTP webserver running.  Access it at:  http://localhost:8080/`);

for await (const conn of server) {
  serveHttp(conn);
}

/**
 * Serves http for connection.
 * @param conn Connection.
 */
async function serveHttp(conn: Deno.Conn) {
  const httpConn = Deno.serveHttp(conn);

  for await (const requestEvent of httpConn) {
    const url = new URL(requestEvent.request.url);

    switch (url.pathname) {
      case "/books": {
        respond(requestEvent, "json", BOOKS_MOCK);
        break;
      }

      case "/json": {
        const body = JSON.stringify({
          hello: "zdarova",
        });
        respond(requestEvent, "json", body);
        break;
      }

      case "/html": {
        const text = await Deno.readTextFile("./src/index.html");
        respond(requestEvent, "html", text);
        break;
      }

      case "/csv": {
        respond(
          requestEvent,
          "csv",
          "id,name,email\n1,Sammy Shark,shark@ocean.com",
        );
        break;
      }

      default: {
        const body = `Page not found.\nYour user-agent is:\n\n${
          requestEvent.request.headers.get("user-agent") ?? "Unknown"
        }`;
        respond(requestEvent, "text", body);
      }
    }
  }
}
