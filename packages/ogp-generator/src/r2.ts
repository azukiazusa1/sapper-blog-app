import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { Env } from "./env.ts";

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${Env.r2AccountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: Env.r2AccessKeyId,
    secretAccessKey: Env.r2SecretAccessKey,
  },
});

export async function checkImageExists(
  key: string,
  contentHash: string,
): Promise<boolean> {
  try {
    const response = await s3.send(
      new HeadObjectCommand({
        Bucket: Env.r2BucketName,
        Key: key,
      }),
    );
    return response.Metadata?.["content-hash"] === contentHash;
  } catch {
    return false;
  }
}

export async function uploadImage(
  key: string,
  png: Uint8Array,
  contentHash: string,
): Promise<void> {
  await s3.send(
    new PutObjectCommand({
      Bucket: Env.r2BucketName,
      Key: key,
      Body: png,
      ContentType: "image/png",
      CacheControl: "public, max-age=31536000, immutable",
      Metadata: {
        "content-hash": contentHash,
      },
    }),
  );
}
