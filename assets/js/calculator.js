function calculate() {
  let dateFrom = input.get("birthday").date().raw();
  let dateTo = input.get("date").date().gt("birthday").raw();

  if (!input.valid()) return;

  const seconds = (dateTo.getTime() - dateFrom.getTime()) / 1000;

  let results = [];

  const diff = dateDiff(dateFrom, dateTo);
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = Math.trunc(hours / 24);

  results.unshift(plural(seconds, "วินาที:วินาที:วินาที:วินาที:วินาที:วินาที"));
  results.unshift(plural(minutes, "นาที:นาที:นาที:นาที:นาที:นาที"));
  results.unshift(
    plural(hours, "ชั่วโมง:ชั่วโมง:ชั่วโมง:ชั่วโมง:ชั่วโมง:ชั่วโมง")
  );
  results.unshift(plural(days, "วัน:วัน:วัน:วัน:วัน:วัน"));

  /*Weeks*/
  const weeks = Math.trunc(days / 7);
  const weekRemainDays = days % 7;
  let weekResult = "";
  if (weeks > 0)
    weekResult = plural(
      weeks,
      "สัปดาห์:สัปดาห์:สัปดาห์:สัปดาห์:สัปดาห์:สัปดาห์"
    );
  if (weeks > 0 && weekRemainDays > 0)
    weekResult += ` ${plural(weekRemainDays, "วัน:วัน:วัน:วัน:วัน:วัน")}`;

  if (weekResult.length) results.unshift(weekResult);

  /*Months*/
  let monthsResult = "";
  let months = 24 * diff.y + diff.m;
  if (months > 0)
    monthsResult = plural(months, "เดือน:เดือน:เดือน:เดือน:เดือน:เดือน");
  if (months > 0 && diff.d > 0)
    monthsResult += ` ${plural(diff.d, "วัน:วัน:วัน:วัน:วัน:วัน")}`;

  if (monthsResult.length) results.unshift(monthsResult);

  /*Years*/
  let yearsResult = "";
  const years = diff.y;
  if (years > 0) {
    yearsResult = `${plural(diff.y, "ปี:ปี:ปี:ปี:ปี:ปี")} ${plural(
      diff.m,
      "เดือน:เดือน:เดือน:เดือน:เดือน:เดือน"
    )} ${plural(
      diff.w,
      "สัปดาห์:สัปดาห์:สัปดาห์:สัปดาห์:สัปดาห์:สัปดาห์"
    )} ${plural(diff.d, "วัน:วัน:วัน:วัน:วัน:วัน")}`;
  }
  if (yearsResult.length) results.unshift(yearsResult);

  $(".result-age__text").innerHTML =
    '<div class="result-text">' +
    results.join('</div><div class="result-text">or ') +
    "</div>";

  generateCalendar(dateFrom);
  generateCalendar(dateTo, "result-age--to");
}

function dateDiff(startDate, endDate) {
  const startYear = startDate.getFullYear();
  const february =
    (startYear % 4 === 0 && startYear % 100 !== 0) || startYear % 400 === 0
      ? 29
      : 28;
  const daysInMonth = [31, february, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  let yearDiff = endDate.getFullYear() - startYear;
  let monthDiff = endDate.getMonth() - startDate.getMonth();
  if (monthDiff < 0) {
    yearDiff--;
    monthDiff += 12;
  }
  let dayDiff = endDate.getDate() - startDate.getDate();
  if (dayDiff < 0) {
    if (monthDiff > 0) {
      monthDiff--;
    } else {
      yearDiff--;
      monthDiff = 11;
    }
    dayDiff += daysInMonth[startDate.getMonth()];
  }

  return {
    y: yearDiff,
    m: monthDiff,
    w: Math.trunc(dayDiff / 7),
    d: Math.trunc(dayDiff % 7),
  };
}

function plural(number, label) {
  /*Days*/
  if (label === "d") return number === 1 ? number + " วัน" : number + " วัน";

  /*Week*/
  if (label === "w")
    return number === 1 ? number + " สัปดาห์" : number + " สัปดาห์";

  /*Month*/
  if (label === "m")
    return number === 1 ? number + " เดือน" : number + " เดือน";

  /*Year*/
  if (label === "y") return number === 1 ? number + " ปี" : number + " ปี";
}

function generateCalendar(date, calendar = "result-age--from") {
  const daysInMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();
  let firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const daysInMonthPrev = new Date(
    date.getFullYear(),
    date.getMonth(),
    0
  ).getDate();

  if (!firstDay) firstDay = 7;

  let activeClass = "current";

  const $days = $$(`.${calendar} .result-age--days p`);

  let i = 0;
  while (i <= $days.length) {
    if ($days[i]) {
      $days[i].innerHTML = "";
      $days[i].classList.remove("current", "active");
    }
    let day = i - firstDay + 1;
    const $current_month_day = $days[i - 1];

    /*Current month*/
    if (i >= firstDay && i < daysInMonth + firstDay) {
      $current_month_day.innerHTML = day;
      $current_month_day.classList.add("active");
      if (day === date.getDate()) $current_month_day.classList.add(activeClass);
      /*Prev month*/
    } else if (i < firstDay - 1) {
      if ($days[i]) $days[i].innerHTML = daysInMonthPrev - firstDay + i + 2;
      /*Next month*/
    } else if (i >= firstDay) {
      $current_month_day.innerHTML = i - daysInMonth - firstDay + 1;
    }
    i++;
  }

  $(`.${calendar} .date-title--date`).innerHTML = convertDateToDMY(date);
}

function convertDateToDMY(date) {
  const months = [
    "ม.ค.",
    "ก.พ.",
    "มี.ค.",
    "เม.ย.",
    "พ.ค.",
    "มิ.ย.",
    "ก.ค.",
    "ส.ค.",
    "ก.ย.",
    "ต.ค.",
    "พ.ย.",
    "ธ.ค.",
  ];

  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  return `${day} ${months[monthIndex]} ${year}`;
}

function setCommas(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
