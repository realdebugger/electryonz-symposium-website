import PageWrapper from "../components/pageWrapper";
const Schedule = () => {
  return (
    <PageWrapper>
      <section className="schedule-wrapper">

        <div className="schedule-table">

          {/* Header */}
          <div className="schedule-row header">
            <div>S.NO</div>
            <div>EVENTS</div>
            <div>DAY</div>
            <div>TIMINGS</div>
          </div>

          {/* Row */}
          <div className="schedule-row">
            <div>01</div>
            <div>INAUGRATION & CHIEF GUEST SPEECH</div>
            <div>Day 1</div>
            <div>09:00 AM – 10:30 AM</div>
          </div>

          <div className="schedule-row">
            <div>02</div>
            <div>SNACKS BREAK</div>
            <div>Day 1</div>
            <div>10:30 AM – 10:40 AM</div>
          </div>

          <div className="schedule-row">
            <div>03</div>
            <div>TECHNICAL EVENT PHASE-I</div>
            <div>Day 1</div>
            <div>10:40 AM – 01:00 PM</div>
          </div>

          <div className="schedule-row">
            <div>04</div>
            <div>LUNCH</div>
            <div>Day 1</div>
            <div>01:00 PM – 01:30 PM</div>
          </div>

          <div className="schedule-row">
            <div>05</div>
            <div>TECHNICAL EVENT PHASE-II</div>
            <div>Day 1</div>
            <div>01:40 PM – 04:00 PM</div>
          </div>

          <div className="schedule-row">
            <div>06</div>
            <div>NON-TECHNICAL EVENTS</div>
            <div>Day 2</div>
            <div>8:45 AM – 01:00 PM</div>
          </div>
          <div className="schedule-row">
            <div>07</div>
            <div style={{ color: "#ff3131", fontWeight: "bold" }}>CULTURALS</div>
            <div>Day 2</div>
            <div>01:40 PM – 05:00 PM</div>
          </div>

        </div>

      </section>
    </PageWrapper>
  );
};

export default Schedule;
