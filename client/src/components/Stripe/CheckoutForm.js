import React, { Component, Fragment } from 'react';
import { CardNumberElement, CardExpiryElement, CardCVCElement, PostalCodeElement, injectStripe } from 'react-stripe-elements';
import API from "../../utils/API";
import Modal from "../../components/Elements/Modal";
import { Link } from 'react-router-dom';
import './CheckoutForm.css';

class CheckoutForm extends Component {
  constructor(props) {
    super(props);
    this.checkout = this.checkout.bind(this);
    this.state = {
      complete: false,
      modal: {
        isOpen: false,
        body: "",
        buttons: ""
      }
    };
  }

  setModal = (modalInput) => {
    console.log(modalInput)
    this.setState({
      modal: {
        isOpen: true,
        body: modalInput.body,
        buttons: modalInput.buttons
      }
    });
  }

  toggleModal = (checkout) => {
    this.setState({
      modal: { isOpen: !this.state.modal.isOpen }
    });
    if (checkout) {
      this.checkout();
    }
  }

  removeRegistrationFromCart = id => {
    // console.log("INSIDE OF THE REMOVE REGISTRATIONS FROM CART FUNCTION")
    this.toggleLoadingModal();
    API.removeRegistrationFromCart(id)
      .then(res => {
        this.props.getUserShoppingCart();
        this.toggleLoadingModal();
      })
      .catch(err => console.log(err));
  }

  removeReservationFromCart = id => {
    this.toggleLoadingModal();
    API.removeReservationFromCart(id)
      .then(res => {
        this.props.getUserShoppingCart();
        this.toggleLoadingModal();
      })
      .catch(err => console.log(err));
  }

  toggleLoadingModal = () => {
    this.setState({
      loadingModalOpen: !this.state.loadingModalOpen
    });
  }

  checkout = () => {
    // console.log("running checkout")
    this.props.toggleLoadingModal();
    let checkArray = [];
    let promiseArray = [];
    // console.log("Start temp reservations")
    // console.log(this.props.tempReservations)
    // console.log("end temp reservatios")
    // console.log("Start temp registrations")
    // console.log(this.props.tempRegistrations)
    // console.log("end temp registrations")
    this.props.tempReservations.forEach(res => {
      const checkQuery = API.finalCheck(res);
      // const resQuery = API.reserveRental(res);
      checkArray.push(checkQuery);
      // promiseArray.push(resQuery);
      // API.finalCheck(res).then(response => { checkArray.push(response.data) })
    });
    this.props.tempRegistrations.forEach(reg => {
      const spaceQuery = API.checkSpace(reg._id, reg)
      // const regQuery = API.reserveCourse(reg._id, reg);
      checkArray.push(spaceQuery);
      // promiseArray.push(regQuery);
      // API.checkSpace(reg).then(response => { checkArray.push(response.data); console.log(checkArray); })
    });
    // if (checkArray.includes('data.response: "success"'))
    // console.log("***CHECKARRAY***");
    // console.log(checkArray);
    // console.log("***PROMISEARRAY***");
    // console.log(promiseArray);
    Promise.all(checkArray)
      .then(response => {
        // console.log(res)
        // console.log(response)
        let noGood = [];
        let types = [];
        for (let i = 0; i < response.length; i++) {
          if (response[i].data.response === "already reserved" || response[i].data.response === "full") {
            noGood.push({ name: response[i].data.info.name, id: response[i].data.tempId, type: response[i].data.info.type })
          }
        }
        // console.log(noGood)
        if (noGood.length > 0) {
          noGood.forEach(del => {
            // console.log(del)
            if (del.type === "course") {
              // console.log("GETTING TO THE REMOVEREGISTRATIONFROM CART FUNCTION")
              this.removeRegistrationFromCart(del.id);
            } else if (del.type === "item") {
              this.removeReservationFromCart(del.id);
            }
            types.push(del.type);
          });
          Promise.all(noGood)
            .then(() => {
              // console.log("start state tempreservations")
              // console.log(this.props.tempRegistrations)
              // console.log(this.props.tempReservations)
              // console.log("end state tempreservations")
              this.props.toggleLoadingModal();
              this.setModal({
                body:
                  <Fragment>
                    <h1>🤯</h1>
                    <br />
                    <h3>Oh no!!</h3>
                    <br />
                    <h4>Someone beat you to the punch and reserved the following {noGood.length === 1 ? "item" : "items"} before you did... </h4>
                    {noGood.map(thing =>
                      <h3 key={thing.name}>{thing.name}</h3>
                    )}
                    <h5>Would you like to remove {noGood.length === 1 ? "it" : "them"} and continue to checkout, or go back and select another date for your reservation?</h5>
                  </Fragment>,
                buttons:
                  <Fragment>
                    {types.includes("course") && types.includes("rental")
                      ? <Link
                        className="modal-btn-link"
                        to={{ pathname: '/rentals' }}
                        role="button"
                      >
                        Select new date
              </Link> &&
                      <Link
                        className="modal-btn-link"
                        to={{ pathname: '/courses' }}
                        role="button"
                      >
                        Select new course
              </Link>
                      : types.includes("course")
                        ? <Link
                          className="modal-btn-link"
                          to={{ pathname: '/courses' }}
                          role="button"
                        >
                          Select new course
              </Link>
                        : types.includes("rental")
                          ? <Link
                            className="modal-btn-link"
                            to={{ pathname: '/rental' }}
                            role="button"
                          >
                            Select new dates
              </Link>
                          : null
                    }
                    <button
                      className="modal-btn-link"
                      onClick={() => this.toggleModal(true)}
                    >
                      Remove
                      </button>
                  </Fragment>
              })
            })
        } else { // ***PAYMENT PROCESSING NEEDS TO GO HERE ***
          this.submit();
        }
      })
      .catch(err => console.log(err));
  }

  // async submit(ev) {
  //   { console.log(parseFloat(this.props.total) * 100) }
  //   let { token } = await this.props.stripe.createToken({ name: "Name" });
  //   let response = await fetch("/charge", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: { token: token.id, chrgAmt: parseFloat(this.props.total) * 100 }
  //   });

  //   if (response.ok) {
  //     console.log("Purchase Complete!")
  //     let promiseArray = [];
  //     this.props.tempReservations.forEach(res => {
  //       const resQuery = API.reserveRental(res);
  //       promiseArray.push(resQuery);
  //     });
  //     this.props.tempRegistrations.forEach(reg => {
  //       const regQuery = API.reserveCourse(reg._id, reg);
  //       promiseArray.push(regQuery);
  //     });
  //     Promise.all(promiseArray)
  //       .then(() => {
  //         this.props.getUserShoppingCart();
  //         this.props.toggleLoadingModal();
  //         this.setState({ complete: true })
  //       });
  //   }
  // }

  async submit(ev) {
    let { token } = await this.props.stripe.createToken({ name: ev.target.name.value });
    let charge = { token: token.id, chrgAmt: this.props.total };
    console.log(charge);
    // let charge = { test: "test" };
    API.charge(charge)
      .then((res) => {
        console.log("GETTING A RESPONSE")
        console.log(res)
        console.log(res.data[0].status);
        if (res.data[0].status === "succeeded") {
          console.log("Purchase Complete!")
          let promiseArray = [];
          this.props.tempReservations.forEach(res => {
            const resQuery = API.reserveRental(res);
            promiseArray.push(resQuery);
          });
          this.props.tempRegistrations.forEach(reg => {
            const regQuery = API.reserveCourse(reg._id, reg);
            promiseArray.push(regQuery);
          });
          Promise.all(promiseArray)
            .then(() => {
              let paymentArray = [];
              this.props.tempReservations.forEach(res => {
                let resTotal = parseFloat(((((res.date.to - res.date.from) / 86400) + 1) * parseFloat(res.dailyRate.$numberDecimal)).toFixed(2));
                const logResPayment = API.logResPayment(res, resTotal);
                paymentArray.push(logResPayment);
              });
              this.props.tempRegistrations.forEach(reg => {
                let regTotal = parseFloat(reg.price.$numberDecimal).toFixed(2);
                const logRegPayment = API.logRegPayment(reg, regTotal);
                paymentArray.push(logRegPayment);
              });
              Promise.all(paymentArray)
                .then(() => {
                  this.props.getUserShoppingCart();
                  this.props.toggleLoadingModal();
                  this.setState({ complete: true });
                });
            });
        }
      })
      .catch(err => console.log(err));
  }

  render() {
    if (this.state.complete) return <h1>Purchase Complete</h1>;

    return (
      <div>
        <Modal
          show={this.state.modal.isOpen}
          toggleModal={this.toggleModal}
          body={this.state.modal.body}
          buttons={this.state.modal.buttons}
        />
        <div className="checkout">
          <p>Would you like to complete the purchase?</p>
          <form action="">
            {/* <label> */}
            <div>
              <span className="test">Name</span>
              <input name="name" className="test" type="text" placeholder="Jane Doe" />
            </div>
            {/* </label> */}
            {/* <label> */}
            Card Number
        <CardNumberElement
              className="input numberInput"
            />
            {/* </label> */}
            {/* <label> */}
            Expiration date
        <CardExpiryElement className="expInput input"
            />
            {/* </label> */}
            {/* <label> */}
            CVC
        <CardCVCElement className="cvcInput input"
            />
            {/* </label> */}
            {/* <label> */}
            Zip code
          <PostalCodeElement className="postalInput input"
            />
            {/* </label> */}
            <button className="chkbtn" onClick={this.checkout}>Pay {this.props.total > 0 ? "$" + this.props.total : null}</button>
          </form>
        </div>
      </div>
    );
  }
}

export default injectStripe(CheckoutForm);