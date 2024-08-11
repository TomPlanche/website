import { differenceBetweenDates, formatDate } from "$lib/globals";
import { describe, expect, it } from "vitest";

describe("Test `globals` functions", () => {
	describe("Test `formatDate`", () => {
		it("should return the formatted date", () => {
			const date = new Date("2021-07-01");
			const formattedDate = formatDate(date);

			expect(formattedDate).toBe("July 2021");
		});

		it("should return the formatted date", () => {
			const date = new Date("2021-12-01");
			const formattedDate = formatDate(date);

			expect(formattedDate).toBe("December 2021");
		});

		it("should return the formatted date", () => {
			const date = new Date("2022-01-01");
			const formattedDate = formatDate(date);

			expect(formattedDate).toBe("January 2022");
		});
	});

	describe("Test `differenceBetweenDates`", () => {
		it("should return the difference between two dates (1 year)", () => {
			const date1 = new Date("2021-07-01");
			const date2 = new Date("2022-07-01");

			const differenceWithEmptyMonths = differenceBetweenDates(
				date1,
				date2,
				false,
				true,
			);
			const differenceWithoutEmptyMonths = differenceBetweenDates(
				date1,
				date2,
				false,
				false,
			);

			expect(differenceWithEmptyMonths).toBe("1 year, 0 months");
			expect(differenceWithoutEmptyMonths).toBe("1 year");
		});

		it("should return the difference between two dates (1 year, 1 month)", () => {
			const date1 = new Date("2021-07-01");
			const date2 = new Date("2022-08-01");
			const difference = differenceBetweenDates(date1, date2);

			expect(difference).toBe("1 year, 1 month");
		});

		it("should return the difference between two dates (1 year, 2 month)", () => {
			const date1 = new Date("2021-07-01");
			const date2 = new Date("2022-09-01");
			const difference = differenceBetweenDates(date1, date2);

			expect(difference).toBe("1 year, 2 months");
		});

		it("should return the difference between two dates (2 year, 1 month)", () => {
			const date1 = new Date("2021-07-01");
			const date2 = new Date("2023-08-01");
			const difference = differenceBetweenDates(date1, date2);

			expect(difference).toBe("2 years, 1 month");
		});

		it("should return the difference between two dates (2 year, 2 month)", () => {
			const date1 = new Date("2021-07-01");
			const date2 = new Date("2023-09-01");
			const difference = differenceBetweenDates(date1, date2);

			expect(difference).toBe("2 years, 2 months");
		});

		it("should return the difference between two dates (11 months)", () => {
			const date1 = new Date("2021-07-01");
			const date2 = new Date("2022-06-01");
			const difference = differenceBetweenDates(date1, date2, false);

			expect(difference).toBe("11 months");
		});

		it("should return the difference between two dates (0 years, 11 months) with empty years", () => {
			const date1 = new Date("2021-07-01");
			const date2 = new Date("2022-06-01");
			const difference = differenceBetweenDates(date1, date2, true);

			expect(difference).toBe("0 years, 11 months");
		});

		it('should throw an error if the "start date" is after the "end date"', () => {
			const date1 = new Date("2021-07-01");
			const date2 = new Date("2020-06-01");

			expect(() => {
				differenceBetweenDates(date1, date2);
			}).toThrowError("The start date must be before the end date");
		});
	});
});
