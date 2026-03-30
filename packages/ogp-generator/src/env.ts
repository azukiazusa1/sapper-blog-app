import dotenv from "dotenv";
import findConfig from "find-config";
dotenv.config({ path: findConfig(".env") || "" });

const {
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET_NAME,
} = process.env;

export const Env = {
  r2AccountId: R2_ACCOUNT_ID || "",
  r2AccessKeyId: R2_ACCESS_KEY_ID || "",
  r2SecretAccessKey: R2_SECRET_ACCESS_KEY || "",
  r2BucketName: R2_BUCKET_NAME || "",
} as const satisfies Record<string, string>;
