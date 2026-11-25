import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createRouter, publicQuery } from "./middleware";
import { createSourceRequest } from "./queries/sourceRequests";

const attempts = new Map<string, number[]>();

function assertRateLimit(key: string) {
  const now = Date.now();
  const recent = (attempts.get(key) ?? []).filter((time) => now - time < 60 * 60 * 1000);
  if (recent.length >= 5) {
    throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "Too many requests" });
  }
  recent.push(now);
  attempts.set(key, recent);
}

export const sourceRequestRouter = createRouter({
  create: publicQuery
    .input(z.object({
      name: z.string().trim().min(2).max(100),
      contact: z.string().trim().min(5).max(180),
      comment: z.string().trim().max(1500).optional().default(""),
      website: z.string().max(200).optional().default(""),
      topic: z.enum(["inventory", "collectors", "registry", "documents"]).optional().default("inventory"),
    }))
    .mutation(async ({ ctx, input }) => {
      if (input.website) return { id: 0 };
      const ip = ctx.req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
      assertRateLimit(ip);
      const topicLabels = {
        inventory: "Исходная ведомость",
        collectors: "Полный видеообзор коллекторов",
        registry: "Выгрузка реестра в CSV",
        documents: "Полный пакет документов",
      } as const;
      return createSourceRequest({
        name: input.name,
        contact: input.contact,
        comment: [`Тема: ${topicLabels[input.topic]}`, input.comment].filter(Boolean).join("\n"),
      });
    }),
});
