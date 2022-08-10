import dayjs from 'dayjs'
import 'dayjs/plugin/timezone'
import 'dayjs/plugin/isSameOrAfter'
import 'dayjs/plugin/isSameOrBefore'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

import 'dayjs/locale/ja'
dayjs.locale('ja')

import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Tokyo')

export default dayjs
