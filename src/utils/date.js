import { addPadStart } from './string';

export function formatDateToString(date) {
    const _date = new Date(date);
    const today = new Date()

    const hour = _date.getHours();
    const minutes = _date.getMinutes();
    const day = _date.getDate();

    const stringDay = day === today.getDate() ? 'Hoje' : addPadStart(day, '0', 2);

    return `${stringDay} às ${addPadStart(hour, '0', 2)}:${addPadStart(minutes, '0', 2)}`

}