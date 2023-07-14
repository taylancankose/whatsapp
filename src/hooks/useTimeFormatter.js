import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export default function useTimeFormatter(time) {
  return dayjs(time).fromNow(true);
}
