export const env = {
  facebookApi: {
    clientId: process.env.FB_CLIENT_ID ?? '746935750073215',
    clientSecret: process.env.FB_CLIENT_SECRET ?? '445b5ed5cd8f9f0d5dc6a727dcea7622'
  },
  port: process.env.PORT ?? 8080,
  jwtSecret: process.env.JWT_SECRET ?? 'dasfdsad4daa'
}
