import {
  formatDuration,
  asFormattedDuration,
  asFilterLabel,
} from "./formatter";
import * as moment from 'moment/moment.js';
import { expect } from 'chai';

describe("Formatter Tests", () => {
  describe("Format Duration", () => {
    it("should format the duration with hours", () => {
      let duration = moment.duration(2, "hours");
      expect(formatDuration(duration)).to.equal("02:00");
    });

    it("should format the duration with minutes", () => {
      let duration = moment.duration(30, "minutes");
      expect(formatDuration(duration)).to.equal("00:30");
    });
  });

  describe("Format Filter Label", () => {
    it("should format the filter label for year", () => {
      let filter = {
        timespan: "year",
        from: moment("2020-11-01"),
      };
      expect(asFilterLabel(filter)).to.equal("2020");
    });

    it("should format the filter label for quarter", () => {
      let filter = {
        timespan: "quarter",
        from: moment("2020-11-01"),
      };
      expect(asFilterLabel(filter)).to.equal("4th Quarter 2020");
    });

    it("should format the filter label for month", () => {
      let filter = {
        timespan: "month",
        from: moment("2020-11-01"),
      };
      expect(asFilterLabel(filter)).to.equal("November 2020");
    });

    it("should format the filter label for week", () => {
      let filter = {
        timespan: "week",
        from: moment("2020-11-01"),
      };
      expect(asFilterLabel(filter)).to.equal("45th Week November 2020");
    });
  });
});
