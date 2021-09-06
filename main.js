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

// Remove key-values not used in output
function removeUnused(employeeWeeks) {
    employeeWeeks.forEach((element) => delete element.Total_Hours);
    employeeWeeks.forEach((element) => delete element.Shifts);
    employeeWeeks.forEach((element) => delete element.Shift_Hours);
    employeeWeeks.forEach((element) => delete element.EWID);
}

createOutput(jsondata);
removeUnused(employeeWeeks)

// write output to output.json file
const FileSystem = require("fs");
FileSystem.writeFile("output.json", JSON.stringify(employeeWeeks), (err) => {
  if (err) throw err;
});