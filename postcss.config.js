module.exports = ctx => ({
  inline: false,
  annotation: true,
  sourcesContent: true,
  plugins: {
    autoprefixer: {
      cascade: false
    }
  }
})
