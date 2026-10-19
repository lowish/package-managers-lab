import dayjs from "dayjs";

const currentDate = dayjs();

console.log("Current date:", currentDate.format("MMMM D, YYYY"));
console.log("Current time:", currentDate.format("h:mm A"));
console.log("Current year:", currentDate.year());