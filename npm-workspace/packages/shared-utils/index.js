function normalizeTitle(title) {
  return title.trim().replace(/\s+/g, " ");
}

module.exports = { normalizeTitle };