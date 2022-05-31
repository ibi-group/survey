// Use type safe message keys with `next-intl`
type Messages = typeof import('./config.json')
type IntlMessages = Messages
