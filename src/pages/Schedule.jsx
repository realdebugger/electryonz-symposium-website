import PageWrapper from "../components/pageWrapper";
const Schedule = () => {
  return (
    <PageWrapper>
    <section className="schedule-wrapper">

      <div className="schedule-table">

        {/* Header */}
        <div className="schedule-row header">
          <div>S.NO</div>
          <div>EVENT</div>
          <div>DAY</div>
          <div>TIMINGS</div>
        </div>

        {/* Row */}
        <div className="schedule-row">
          <div>01</div>
          <div>INAUGRATION</div>
          <div>Day 1</div>
          <div>09:00 AM – 10:00 AM</div>
        </div>

        <div className="schedule-row">
          <div>02</div>
          <div>WORKSHOP 1</div>
          <div>Day 1</div>
          <div>10:30 AM – 01:00 PM</div>
        </div>

        <div className="schedule-row">
          <div>03</div>
          <div>WORKSHOP 2</div>
          <div>Day 1</div>
          <div>02:00 PM – 04:30 PM</div>
        </div>

        <div className="schedule-row">
          <div>04</div>
          <div>INAUGRATION OF DAY 2</div>
          <div>Day 2</div>
          <div>09:30 AM – 11:00 AM</div>
        </div>

        <div className="schedule-row">
          <div>05</div>
          <div>TECHNICAL EVENTS</div>
          <div>Day 2</div>
          <div>11:00 AM – 01:00 PM</div>
        </div>
        <div className="schedule-row">
          <div>06</div>
          <div>TECHNICAL EVENTS</div>
          <div>Day 2</div>
          <div>02:00 PM – 05:00 PM</div>
        </div>

      </div>

    </section>
    </PageWrapper>
  );
};

export default Schedule;
