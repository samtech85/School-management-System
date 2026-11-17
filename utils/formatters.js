function toIsoDate(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
}

function fullName(user) {
  return [user.first_name, user.last_name].filter(Boolean).join(" ");
}

module.exports = { toIsoDate, fullName };
