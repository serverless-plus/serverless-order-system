function getToday() {
  const d = new Date();
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hour = d.getHours();
  const minute = d.getMinutes();
  const second = d.getSeconds();

  function standardNum(num) {
    return num > 9 ? num : `0${num}`;
  }

  return `${year}-${month}-${day} ${standardNum(hour)}:${standardNum(
    minute,
  )}:${standardNum(second)}`;
}

module.exports = {
  getToday,
};
