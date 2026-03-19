import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// Ini adalah jembatan agar frontend bisa ngobrol dengan core.ts kita
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});