import React, { useState } from "react";

function DayPlan({ name, content, handleCheck }) {
  const [check, setCheck] = useState(false);

  const checkFn = (check) => {
    setCheck((c) => !c);
    handleCheck(check);
  };

  return (
    <div className="day-plan">
      <input type="checkbox" checked={check} onChange={checkFn} />
      <h2 className="day-plan-h2">{name}</h2>
      <h4 className="day-plan-h4">{content}</h4>
    </div>
  );
}

export default DayPlan;
