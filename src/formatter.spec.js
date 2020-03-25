import {
  formatDuration,
  asFormattedDuration,
  asFilterLabel
} from "./formatter.js";
import moment from 'moment/src/moment';
import assert from 'assert';

describe('Formatter Tests', function() {
  describe('formatDuration', function() {

    it('should format the duration with hours', () => {
      let duration = moment.duration(2, 'hours');
      assert.equal(formatDuration(duration), '02:00');
    });

    it('should format the duration with minutes', () => {
      let duration = moment.duration(30, 'minutes');
      assert.equal(formatDuration(duration), '00:30');
    });

  });
});
