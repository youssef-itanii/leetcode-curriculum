import { z } from "zod";

import { getGraphQLData } from "./getGraphQLData";
import { sleep } from "./sleep";

const QUERY = `
  query {
    activeDailyCodingChallengeQuestion {
      date
      question {
        questionFrontendId
        title
        titleSlug
      }
    }
  }
`
  .trim()
  .replace(/\s+/g, " ");

const questionParser = z
  .object({
    questionFrontendId: z.string().regex(/^[1-9][0-9]*$/),
    title: z.string().min(1).trim(),
    titleSlug: z
      .string()
      .trim()
      .regex(/^[a-z0-9\-]+$/),
  })
  .transform(({ questionFrontendId, title, titleSlug }) => ({
    problemNumber: parseInt(questionFrontendId),
    title,
    titleSlug,
  }));

const activeDailyCodingChallengeQuestionParser = z
  .object({
    activeDailyCodingChallengeQuestion: z.object({
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      question: questionParser,
    }),
  })
  .transform((data) => data.activeDailyCodingChallengeQuestion);

export type ActiveDailyCodingChallengeQuestion = z.infer<
  typeof activeDailyCodingChallengeQuestionParser
>;

export async function getActiveDailyCodingChallengeQuestionWithoutDateValidation(): Promise<ActiveDailyCodingChallengeQuestion> {
  const { data } = await getGraphQLData(QUERY);
  return activeDailyCodingChallengeQuestionParser.parse(data);
}

export async function getActiveDailyCodingChallengeQuestionWithDateValidation(
  wrongDateRetries: number = 3,
): Promise<ActiveDailyCodingChallengeQuestion> {
  for (let retry = 0; retry <= wrongDateRetries; ++retry) {
    const res =
      await getActiveDailyCodingChallengeQuestionWithoutDateValidation();

    const now = new Date();
    const today = [
      now.getUTCFullYear(),
      (now.getUTCMonth() + 1).toString().padStart(2, "0"),
      now.getUTCDate().toString().padStart(2, "0"),
    ].join("-");

    if (res.date === today) {
      return res;
    }

    // Wait a minute then try again.
    await sleep(60000);
  }

  throw new Error("Exhausted wrong date retries!");
}
