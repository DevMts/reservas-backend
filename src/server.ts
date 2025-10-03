import { app } from "./app";
import { env } from "./env";
import { userRoutes } from "./http/routes/user";

app.listen({ port: env.PORT }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}, in ${env.PORT} mode`);
});
app.register(userRoutes, {
  prefix: '/user',
})
