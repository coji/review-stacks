import type { NextApiRequest, NextApiResponse } from 'next'
import { App } from '@slack/bolt'
import NextConnectReceiver from '~/libs/next-connect-receiver'

const receiver = new NextConnectReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET || 'invalid',
  // The `processBeforeResponse` option is required for all FaaS environments.
  // It allows Bolt methods (e.g. `app.message`) to handle a Slack request
  // before the Bolt framework responds to the request (e.g. `ack()`). This is
  // important because FaaS immediately terminate handlers after the response.
  processBeforeResponse: true
})

// Initializes your app with your bot token and the AWS Lambda ready receiver
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver: receiver,
  developerMode: false
})

app.event('message', async ({ event, message, say }) => {
  await say({
    text: `${message} - ${JSON.stringify(message.subtype)}`
  })
})

// this is run just in case
const router = receiver.start()

router.get('/api', (req: NextApiRequest, res: NextApiResponse) => {
  console.log(req)
  res.status(200).json({
    test: true
  })
})

export default router
