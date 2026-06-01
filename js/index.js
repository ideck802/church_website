/* eslint-disable max-len */

function convert24To12Hour(timeString) {
  // Step 2: Split into hours, minutes, seconds
  const [hours24, minutes] = timeString.split(':');

  // Step 3: Convert hours to 12-hour format
  const hours12 = parseInt(hours24, 10) % 12 || 12;

  // Step 4: Determine AM/PM
  const period = parseInt(hours24, 10) < 12 ? ' AM' : ' PM';

  // Step 5: Format output (no seconds, no leading zeros)
  return `${hours12}:${minutes}${period}`;
}

fetch('events.json').then(response => response.json())
  .then(events => {
    const eventList = document.getElementById('event_list');
    const sortedEvents = sortEvents(events);
    let html = '';

    const dateFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };

    sortedEvents.forEach(event => {
      let dateStr = '';

      if (event.start_time === false && event.start_date === event.end_date) {
        // Handle events with no time and same start/end date
        dateStr = new Date(event.start_date).toLocaleDateString('en-US', dateFormatOptions);
      } else if (event.start_time === false) {
        // Handle events with no time but different start/end dates
        const startDateStr = new Date(event.start_date).toLocaleDateString('en-US', dateFormatOptions);
        const endDateStr = new Date(event.end_date).toLocaleDateString('en-US', dateFormatOptions);

        dateStr = `${startDateStr} - ${endDateStr}`;
      } else if (event.start_date === event.end_date) {
        // Handle events with time and same start/end date
        const time = convert24To12Hour(event.start_time);

        dateStr = `${new Date(event.start_date).toLocaleDateString('en-US', dateFormatOptions)} at ${time}`;
      } else {
        // Handle events with time and different start/end dates
        const time = convert24To12Hour(event.start_time);
        const startDateStr = `${
          new Date(event.start_date).toLocaleDateString('en-US', dateFormatOptions)
        } at ${time}`;

        const endDateStr = new Date(event.end_date).toLocaleDateString('en-US', dateFormatOptions);
        dateStr = `${startDateStr} - ${endDateStr}`;
      }

      html += `
        <div class="event">
            <h4>${event.title}</h4>
            <p>${dateStr}</p>`;

      if (event.details !== '') {
        html += `<p>${event.details}</p>`;
      }

      html += '</div>';
    });
    eventList.innerHTML = html;
  });

function sortEvents(events) {
  console.log(events);
  const sorted = [...events].sort((a, b) => {
    // Combine date + time
    const aDateTime = new Date(
      `${a.start_date}T${a.start_time || '00:00'}`
    );

    const bDateTime = new Date(
      `${b.start_date}T${b.start_time || '00:00'}`
    );

    return aDateTime - bDateTime;
  });
  console.log(sorted);
  return sorted;
}
