// Utility function to format date in ISO format (yyyy-MM-dd)
export const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (`0${d.getMonth() + 1}`).slice(-2); // zero pad month
    const day = (`0${d.getDate()}`).slice(-2); // zero pad day
    return `${year}-${month}-${day}`;
  };
  