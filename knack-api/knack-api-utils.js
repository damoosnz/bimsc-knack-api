export const utils = {
    isoTo_MMDDYYYY: (isoDate) => isoDatestoKnackDatesMMDDYYYY (isoDate),
    isoTo_DDMMYYYY : (isoDate) => isoDatestoKnackDatesDDMMYYYY (isoDate)
}

function isoDatestoKnackDatesMMDDYYYY (isoDate) {
    isoDate = new Date(isoDate)
    return  {
        date: isoDate.toLocaleDateString('en-US'), // Convert to "MM/DD/YYYY" format
        // iso_timestamp: item.creationTime,
        hours: ((isoDate.getUTCHours() % 12) || 12).toString().padStart(2, '0'),
        minutes: isoDate.getUTCMinutes().toString().padStart(2, '0'),
        am_pm: isoDate.getUTCHours() >= 12 ? 'PM' : 'AM',
        // unix_timestamp: isoDate.getTime(),
        // timestamp: isoDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
      }

}

function isoDatestoKnackDatesDDMMYYYY (isoDate) {
    isoDate = new Date(isoDate)
    return  {
        date: isoDate.toLocaleDateString('en-GB'), // Convert to "MM/DD/YYYY" format
        // iso_timestamp: item.creationTime,
        hours: ((isoDate.getUTCHours() % 12) || 12).toString().padStart(2, '0'),
        minutes: isoDate.getUTCMinutes().toString().padStart(2, '0'),
        am_pm: isoDate.getUTCHours() >= 12 ? 'PM' : 'AM',
        // unix_timestamp: isoDate.getTime(),
        // timestamp: isoDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
      }

}