import { createServerFn } from "@tanstack/react-start";
import { queryBranOracle, type Message } from "@/lib/branService";

export const chatWithBran = createServerFn({ method: "POST" })
  .validator((data: { message: string; history?: Message[] }) => data)
  .handler(async ({ data }) => {
    const answer = await queryBranOracle(data.message, data.history || []);
    return { answer };
  });
