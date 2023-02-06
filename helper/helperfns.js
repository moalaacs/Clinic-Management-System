const filterData = (model, query) => {
  let filter = {};
  for (let key in query) {
    let value = key;
    if (value.includes("<")) {
      value.charAt(value.length - 1) == "<"
        ? (filter[key.slice(0, key.indexOf("<"))] = { $lte: query[key] })
        : (filter[key.slice(0, key.indexOf("<"))] = {
            $lt: +value.slice(value.indexOf("<") + 1),
          });
    } else if (value.includes(">")) {
      value.charAt(value.length - 1) == ">"
        ? (filter[key.slice(0, key.indexOf(">"))] = { $gte: query[key] })
        : (filter[key.slice(0, key.indexOf(">"))] = {
            $gt: +value.slice(value.indexOf(">") + 1),
          });
    } else {
      filter[key] = query[key];
    }
  }
  return model.find({ ...filter });
};

const paginateData = (data, query) => {
  let page = query.page || 1;
  let limit = query.limit || 10;
  return data.slice((page - 1) * limit, page * limit);
};

const sortData = (data, query) => {
  let sortBy = query.sortBy || "_id";
  let order = query.order || "asc";
  let orderValue = order === "asc" ? 1 : -1;

  return data.sort((a, b) => {
    if (a[sortBy] < b[sortBy]) return -1 * orderValue;
    if (a[sortBy] > b[sortBy]) return 1 * orderValue;
    return 0;
  });
};

const sliceData = (data, query) => {
  let start = query.start || 0;
  let end = query.end || data.length;
  return data.slice(start, end);
};

module.exports = {
  filterData,
  paginateData,
  sortData,
  sliceData,
};
