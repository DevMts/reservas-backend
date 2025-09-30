// import { app } from "./app";
// import { auth } from "./lib/auth";

// app.get("/", async (request, reply) => {
//   return { hello: "world" };
// });

// Register authentication endpoint
// app.route({
//   method: ["GET", "POST"],
//   url: "/api/auth/*",
//   async handler(request, reply) {
//     try {
//       const url = new URL(request.url, `http://${request.headers.host}`);

//       const headers = new Headers();
//       Object.entries(request.headers).forEach(([key, value]) => {
//         if (value) headers.append(key, value.toString());
//       });

//       const req = new Request(url.toString(), {
//         method: request.method,
//         headers,
//         body: request.body ? JSON.stringify(request.body) : undefined,
//       });

//       const response = await auth.handler(req);

//       reply.status(response.status);
//       response.headers.forEach((value, key) => reply.header(key, value));
//       reply.send(response.body ? await response.text() : null);
//     } catch (error) {
//       app.log.error("Authentication Error:");
//       reply.status(500).send({
//         error: "Internal authentication error",
//         code: "AUTH_FAILURE",
//       });
//     }
//   },
// });
