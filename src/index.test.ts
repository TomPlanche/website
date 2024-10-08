import { differenceBetweenDates, formatDate, mapRange } from "$lib/globals";
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

	describe("Test `mapRange`", () => {
		it("test with 0, no out, no clamp", () => {
			const number = 0;
			const range = mapRange(number, 0, 255);

			expect(range).toEqual(0);
		});

		it("test with 255, no out, no clamp", () => {
			const number = 255;
			const range = mapRange(number, 0, 255);

			expect(range).toEqual(1);
		});

		it("test with 0, out, no clamp", () => {
			const number = 0;
			const range = mapRange(number, 0, 255, 0, 100);

			expect(range).toEqual(0);
		});

		it("test with 255, out (0-100), no clamp", () => {
			const number = 255;
			const range = mapRange(number, 0, 255, 0, 100);

			expect(range).toEqual(100);
		});

		it("test with 255, out (0-100), no clamp", () => {
			const number = 255;
			const range = mapRange(number, 0, 255, 0, 100);

			expect(range).toEqual(100);
		});

		it("test with 256, out (0-100), clamp", () => {
			const number = 256;
			const range = mapRange(number, 0, 255, 0, 100, true);

			expect(range).toEqual(100);
		});

		it("test with median value, no specified output, no clamp", () => {
			const number = 127.5;
			const range = mapRange(number, 0, 255);

			expect(range).toBeCloseTo(0.5);
		});

		it("test with negative input value, no clamp", () => {
			const number = -50;
			const range = mapRange(number, -100, 100, 0, 1);

			expect(range).toBeCloseTo(0.25);
		});

		it("test with inverted output range, no clamp", () => {
			const number = 75;
			const range = mapRange(number, 0, 100, 1, 0);

			expect(range).toBeCloseTo(0.25);
		});

		it("test with out-of-bounds value, with clamp", () => {
			const number = 150;
			const range = mapRange(number, 0, 100, 0, 1, true);

			expect(range).toEqual(1);
		});

		it("test with negative out-of-bounds value, with clamp", () => {
			const number = -50;
			const range = mapRange(number, 0, 100, 0, 1, true);

			expect(range).toEqual(0);
		});

		it("test with identical input and output ranges", () => {
			const number = 75;
			const range = mapRange(number, 0, 100, 0, 100);

			expect(range).toEqual(75);
		});

		it("test with floating-point numbers", () => {
			const number = 3.14;
			const range = mapRange(number, 0, 10, 0, 100);

			expect(range).toBeCloseTo(31.4);
		});

		it("test with very large ranges", () => {
			const number = 1e6;
			const range = mapRange(number, 0, 1e9, 0, 100);

			expect(range).toBeCloseTo(0.1);
		});
	});
});
