export const style_vars = {
	mainPadding: "2rem",
	headerHeight: "5rem",
};

const { headerHeight } = style_vars;

export const pageSizeWithPadding = `calc(100vh - ${headerHeight})`;

/**
 * Formats a date into a `Month Year` string.
 *
 * @param date - The date to format.
 *
 * @returns {string} The formatted date.
 */
export const formatDate = (date: Date): string => {
	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	const month = months[date.getMonth()];
	const year = date.getFullYear();

	return `${month} ${year}`;
};

/**
 * Formats the difference between two dates into a string of the form `X years, Y months`.
 *
 * @param startDate {Date} - The start date.
 * @param endDate {Date} - The end date.
 * @param emptyYears {boolean} - Whether to include years in the output if the difference is 0.
 * @param emtpyMonths {boolean} - Whether to include months in the output if the difference is 0.
 *
 * @returns {string} The formatted difference between the two dates.
 */
export const differenceBetweenDates = (
	startDate: Date,
	endDate: Date,
	emptyYears = false,
	emtpyMonths = false,
): string => {
	if (startDate.getTime() === endDate.getTime()) {
		return "1 month";
	}

	const monthDiff =
		(endDate.getFullYear() - startDate.getFullYear()) * 12 +
		(endDate.getMonth() - startDate.getMonth());

	if (monthDiff < 0) {
		throw new Error("The start date must be before the end date");
	}

	const years = Math.floor(monthDiff / 12);
	const months = monthDiff % 12;

	const yearsString = `${years} year${years === 1 ? "" : "s"}`;
	const monthsString = `${months} month${months === 1 ? "" : "s"}`;

	if (years > 0 || emptyYears) {
		if (months > 0 || emtpyMonths) {
			return `${yearsString}, ${monthsString}`;
		}

		return yearsString;
	}

	return monthsString;
};

/**
 * Convert miliseconds to object
 *
 * @param ms The number of miliseconds
 *
 */
export const msToTime = (ms: number) => {
	const seconds = Math.floor((ms / 1000) % 60);
	const minutes = Math.floor((ms / (1000 * 60)) % 60);
	const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);

	const stringified = {
		seconds: seconds.toString().padStart(2, "0"),
		minutes: minutes.toString().padStart(2, "0"),
		hours: hours.toString().padStart(2, "0"),
	};

	return {
		hours,
		minutes,
		seconds,
		string:
			hours > 0
				? `${stringified.hours}:${stringified.minutes}:${stringified.seconds}`
				: minutes > 0
					? `${stringified.minutes}:${stringified.seconds}`
					: `${stringified.seconds}`,
	};
};

export const baseUrl = "http://localhost:5173";
