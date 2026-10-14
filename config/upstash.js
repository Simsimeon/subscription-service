import { Client as UpstashWorkflowClient } from "@upstash/workflow";
import { QSTASH_URL, QSTASH_TOKEN } from "./env.js";

export const WorkFlowClient = new UpstashWorkflowClient({
  baseUrl: QSTASH_URL,
  token: QSTASH_TOKEN,
});