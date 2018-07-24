

module.exports = {

  charge: function (req, res) {
    console.log("***THIS IS THE CHARGECONTROLLER REQ.BODY! MAKE IT AWESOME***")
    console.log(req.body)
    // let { status } = await stripe.charges.create({
    //   amount: req.body.chrgAmt,
    //   currency: "usd",
    //   description: "An example charge",
    //   source: req.body.token
    // });
  }

}