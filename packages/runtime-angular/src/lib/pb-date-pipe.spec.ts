import {PbDatePipe} from "./pb-date-pipe";

describe('PbDatePipe', () => {
  let pipe: PbDatePipe = new PbDatePipe("en-US");

  let jsDate = new Date(2020, 11, 24, 11, 45, 59);
  let isoDate = jsDate.toISOString();
  let dateTimeLocal = {
    year: 2020,
    month: 12,
    day: 24,
    hours: 11,
    minutes: 45,
    seconds: 59,
    nanos: 0,
    timeOffset: {oneofKind: undefined}
  };
  let dateTimeOffset = {
    year: 2020,
    month: 12,
    day: 24,
    hours: 11,
    minutes: 45,
    seconds: 59,
    nanos: 0,
    timeOffset: {
      oneofKind: "utcOffset",
      utcOffset: {
        seconds: -3600,
        nanos: 0
      }
    }
  };
  let timestamp = {
    seconds: (jsDate.getTime() / 1000).toString(),
    nanos: 0,
  }

  it('should accept JavaScript Date', function () {
    let text = pipe.transform(jsDate, 'medium');
    expect(text).toBe("Dec 24, 2020, 11:45:59 AM");
  });

  it('should accept google.protobuf.Timestamp', function () {
    let text = pipe.transform(timestamp, 'medium');
    expect(text).toBe("Dec 24, 2020, 11:45:59 AM");
  });

  it('should accept ISO date string', function () {
    let text = pipe.transform(isoDate, 'medium');
    expect(text).toBe("Dec 24, 2020, 11:45:59 AM");
  });

  it('should accept google.type.DateTime without timeOffset', function () {
    let text = pipe.transform(dateTimeLocal, 'medium');
    expect(text).toBe("Dec 24, 2020, 11:45:59 AM");
  });

  it('should accept google.type.DateTime with timeOffset', function () {
    let text = pipe.transform(dateTimeOffset, 'medium', 'UTC');
    expect(text).toBe("Dec 24, 2020, 10:45:59 AM");
  });

});
