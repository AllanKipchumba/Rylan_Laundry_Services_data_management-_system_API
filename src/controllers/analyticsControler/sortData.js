const sortDataByYear = (revenueData, dataFields) => {
  const sortedData = revenueData.reduce((acc, curr) => {
    const year = curr._id.year;
    const month = curr._id.month;
    const dataObj = {};

    dataFields.map((field) => {
      dataObj[field] = curr[field];
    });

    if (!acc[year]) {
      acc[year] = {
        year: year,
        data: [],
      };

      dataFields.map((field) => {
        acc[year][field] = 0;
      });
    }

    acc[year].data.push({ month: month, data: dataObj });

    dataFields.map((field) => {
      acc[year][field] += curr[field];
    });

    return acc;
  }, {});

  return Object.values(sortedData);
};

module.exports = sortDataByYear;
