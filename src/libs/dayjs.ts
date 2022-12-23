import dayjs, { extend, locale } from 'dayjs'
import 'dayjs/plugin/isSameOrAfter'
import 'dayjs/plugin/isSameOrBefore'
import relativeTime from 'dayjs/plugin/relativeTime'
extend(relativeTime)

import 'dayjs/locale/ja'
locale('ja')

import utc from 'dayjs/plugin/utc'
extend(utc)
import timezone from 'dayjs/plugin/timezone'
extend(timezone)
dayjs.tz.setDefault('Asia/Tokyo')

export default dayjs
