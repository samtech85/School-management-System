const fs = require("fs");
const path = require("path");

function listBackups(req, res, next) {
  const backupDirectory = path.join(__dirname, "..", "backups");
  fs.readdir(backupDirectory, { withFileTypes: true }, (error, entries) => {
    if (error) return next(error);
    const backups = entries
      .filter((entry) => entry.isFile() && entry.name !== ".gitkeep")
      .map((entry) => entry.name);
    return res.json({ backups });
  });
}

module.exports = { listBackups };
