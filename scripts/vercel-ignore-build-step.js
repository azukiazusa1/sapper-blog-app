const https = require('https')
const { exec } = require('child_process')

exec('git diff --quiet HEAD^ HEAD .', (error, stdout, stderr) => {
  if (error) {
    console.log(`detected changes in the project`)
    console.log('✅ - Build can proceed')
    process.exit(1)
  } else {
    console.log('no changes detected')
  }
})

if (process.env.VERCEL_GIT_COMMIT_REF === 'gf-pages') {
  console.log('branch is gf-pages')
  console.log('🛑 - Build cancelled')
  process.exit(0)
}

const options = {
  hostname: 'api.vercel.com',
  port: 443,
  path: `/v13/deployments/${process.env.VERCEL_URL}`,
  method: 'GET',
  headers: {
    Authorization: `Bearer ${process.env.VERCEL_API_ACCESS_TOKEN}`,
  },
}

let data = ''

const req = https.request(options, (res) => {
  res.on('data', (d) => {
    data += d.toString()
  })
  res.on('end', (d) => {
    let parsedData = JSON.parse(data)
    const prodRunningFromDeployHook =
      parsedData.target === 'production' && parsedData.meta.deployHookName === 'contentful'

    console.log({
      target: parsedData.target,
      hook: parsedData.meta.deployHookName,
    })

    if (prodRunningFromDeployHook) {
      console.log('✅ - Build can proceed')
      process.exit(1)
    } else {
      console.log('🛑 - Build cancelled')
      process.exit(0)
    }
  })
})

req.on('error', (error) => {
  console.error(error)
})

req.end()
