import { createClient } from '../client'

type Params = {
  fileName: string
  contentType: string
  file: string | ArrayBuffer
}

export const uploadFile = async ({ fileName, file, contentType }: Params) => {
  const client = await createClient()
  const asset = await client.createAssetFromFiles({
    fields: {
      title: {
        'en-US': fileName,
      },
      description: {
        'en-US': '',
      },
      file: {
        'en-US': {
          contentType,
          fileName,
          file,
        },
      },
    },
  })
  const processedAsset = await asset.processForAllLocales()
  await processedAsset.publish()
  return processedAsset
}
