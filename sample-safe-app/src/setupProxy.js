module.exports = function (app) {
  app.use("/manifest.json", function (req, res, next) {
    res.set({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "*",
    })

    next()
  })
}
