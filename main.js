const { differenceInMinutes, startOfWeek } = require("date-fns");
const fs = require("fs");
var jsondata = JSON.parse(fs.readFileSync("dataset.json"));
var employeeWeeks = [];

// Create newEW (EmployeeWeek)
function createEW(currentWeekStart, shiftLength, shift) {
  var newEW = {
    EmployeeID: shift.EmployeeID,
    StartOfWeek: currentWeekStart.toString(),
    EWID: shift.EmployeeID + " " + currentWeekStart.toString(),
    Shifts: [
      {
        ShiftID: shift.ShiftID,
        ClockIn: shift.StartTime,
        ClockOut: shift.EndTime,
      },
    ],
    Shift_Hours: [shiftLength],
    Total_Hours: shiftLength,
    RegularHours: shiftLength,
    OvertimeHours: 0,
    InvalidShifts: [],
  };
  try {
    if (newEW == {}) throw "currentWeek is empty";
    if (newEW.Shifts == []) throw "no Shifts listed";
    if (isNaN(newEW.EmployeeID)) throw "EmployeeID is not number";
    if (newEW.Regular_Hours == 0) throw "no hours calculated";
  } catch (err) {
    throw err;
  }
  return newEW;
}

// Update Employee week to add new shift information
function updateEW(currentEmployeeWeek, currentWeekStart, shiftLength, shift) {
  if (currentEmployeeWeek.StartOfWeek == currentWeekStart.toString()) {
    currentEmployeeWeek.Shifts.push({
      ShiftID: shift.ShiftID,
      ClockIn: shift.StartTime,
      ClockOut: shift.EndTime,
    });
    currentEmployeeWeek.Shift_Hours.push(shiftLength);
    currentEmployeeWeek.Total_Hours += shiftLength;
    if (currentEmployeeWeek.Total_Hours > 40) {
      currentEmployeeWeek.RegularHours = 40;
      currentEmployeeWeek.OvertimeHours = currentEmployeeWeek.Total_Hours - 40;
    }
    employeeWeeks.push(currentEmployeeWeek);
  }
}

// update employeeWeeks array when eash shift is iterated
function createOutput(jsondata) {
  for (const x in jsondata) {
    let shift = jsondata[x];
    let startTime = new Date(shift.StartTime),
      endTime = new Date(shift.EndTime);
    let shiftLength = differenceInMinutes(endTime, startTime) / 60;
    let currentWeekStart = startOfWeek(startTime);
    let currentEmployeeWeek = employeeWeeks.find(
      (employeeWeek) => employeeWeek["EmployeeID"] === shift.EmployeeID
    );
    // let currentEmployeeWeek = currentEmployee.find(
    //     (e) => e["StartOfWeek"] === shift.StartOfWeek
    //   );
    if (currentEmployeeWeek) {
      updateEW(currentEmployeeWeek, currentWeekStart, shiftLength, shift);
      // verifyShift(currentEmployeeWeek, shift)
    } else {
      employeeWeeks.push(createEW(currentWeekStart, shiftLength, shift));
    }
  }
}

// Remove keys not used in output
function removeUnused(employeeWeeks) {
    employeeWeeks.forEach((element) => delete element.Total_Hours);
    employeeWeeks.forEach((element) => delete element.Shifts);
    employeeWeeks.forEach((element) => delete element.Shift_Hours);
    employeeWeeks.forEach((element) => delete element.EWID);
}

createOutput(jsondata);
removeUnused(employeeWeeks)
// createOutput(JSON.parse(fs.readFileSync("dataset.test.json")))

// Remove keys not used in output
// employeeWeeks.forEach((element) => delete element.Total_Hours);
// employeeWeeks.forEach((element) => delete element.Shifts);
// employeeWeeks.forEach((element) => delete element.Shift_Hours);
// employeeWeeks.forEach((element) => delete element.EWID);


console.log(employeeWeeks.slice(Math.max(employeeWeeks.length - 5, 0)));
console.log(employeeWeeks.length);
// const output = employeeWeeks.filter((v,i,a)=>a.findIndex(t=>(t.EmployeeID === v.EmployeeID && t.StartOfWeek===v.StartOfWeek))===i)
var output = [...new Set(employeeWeeks)];
// JSON.stringify(output)

function uniqueEWIDs(arr, prop) {
  const uniques = new Set(arr.map((item) => item[prop]));
  return [...uniques].length == arr.length;
}
console.log(output.slice(Math.max(output.length - 5, 0)));
console.log(output.length);
console.log(uniqueEWIDs(output, "EWID"));

const FileSystem = require("fs");
FileSystem.writeFile("output.json", JSON.stringify(employeeWeeks), (err) => {
  if (err) throw err;
});

// function verifyShift(currentEmployeeWeek, shift) {
//     // for (const e in currentEmployeeWeek.Shifts) {
//         console.log("VERIFY TEST")
//         // console.log(currentEmployeeWeek.Shifts)
//         // const sample = currentEmployeeWeek.Shifts.find(function(x, index){
//         //     console.log(x)
//         //     return x.Clockin === true;
//         // })
//         // const sample = currentEmployeeWeek.Shifts.find(e => e.ClockIn)
//         // console.log(sample)
//         // console.log(shift.clockIn)
//     // for( const prevShift in currentEmployeeWeek.Shifts) {
//     //     console.log("SPLIT")
//     //     console.log(Object.keys(prevShift))
//     // }

// }

// try {
//     if (newEW == {}) throw "currentWeek is empty"
//     if (newEW.Shifts == []) throw "no Shifts listed"
//     if (isNaN(newEW.EmployeeID)) throw "EmployeeID is not number"
//     if ( newEW.Regular_Hours == 0 ) throw "no hours calculated"
// }
// catch(err) {
//     throw err
// }
