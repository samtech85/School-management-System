function escapeCsv(value) {
  const text = value == null ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

function toCsv(rows, columns) {
  const header = columns.map((column) => escapeCsv(column.label)).join(",");
  const body = rows.map((row) =>
    columns.map((column) => escapeCsv(row[column.key])).join(",")
  );
  return [header, ...body].join("\r\n");
}

function sendCsv(res, filename, rows, columns) {
  res.type("text/csv");
  res.set("Content-Disposition", `attachment; filename="${filename}"`);
  return res.send(toCsv(rows, columns));
}

module.exports = { toCsv, sendCsv };
