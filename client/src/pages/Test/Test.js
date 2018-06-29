import React, { Component, Fragment } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import API from "../../utils/API";
import Modal from "../../components/Modal";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import ParallaxHero from "../../components/ParallaxHero"
import { Input, FormBtn } from "../../components/Form";
import DevLinks from "../../components/DevLinks";
import RentalCard from "../../components/RentalCard";
import "./Test.css";

class Test extends Component {
  state = {
    isOpen: false,
    header: "",
    body: "",
    footer: "",
    rentals: [],
    images: [],
    rentalId: "",
    selectedFile: null,
    image: null
  };

  componentDidMount() {
    this.getAllRentals();
    axios.get("/image")
      .then(image => {
        this.setState({
          image: image
        });
      })
  }

  toggleModal = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  setModal = (modalInput) => {
    this.setState({
      isOpen: !this.state.isOpen,
      header: modalInput.header,
      body: modalInput.body,
      footer: modalInput.footer
    });
  }

  getAllRentals = () => {
    API.getAllRentals()
      .then(res => {
        this.setState({
          rentals: res.data
        });
        console.log(this.state.rentals);
      })
      .catch(err => console.log(err));
  }

  getByCategory = category => {
    API.getRentalsByCategory(category)
      .then(res => {
        this.setState({
          rentals: res.data
        })
        console.log(this.state.rentals);
      })
      .catch(err => console.log(err));
  }

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleDateSearch = event => {
    event.preventDefault();
    // const from = this.state.date_from;
    // const to = this.state.date_to;
    const from = "1532088600";
    const to = "1532390200";

    console.log(from);
    console.log(to);

    API.getRentalsByDates(from, to)
      .then(res => {
        console.log(res);
      })
      .catch(err => console.log(err));
  }

  fileSelectedHandler = event => {
    const newFile = event.target.files[0];
    this.setState({
      selectedFile: newFile
    });
  };

  handleUpload = event => {
    event.preventDefault();
    const { name } = event.target;
    const fd = new FormData();
    fd.append('file', this.state.selectedFile, this.state.selectedFile.name);
    API.uploadImage(name, fd).then(res => console.log(res));
  }

  getImages = id => {
    API.getImageNames(id).then(res => {
      this.setState({
        images: res.data,
        rentalId: id
      })
      console.log("Images in state:");
      console.log(this.state.images);
    });
  }

  deleteImage = image => {
    API.deleteImage(image, this.state.rentalId)
      .then(res => {
        this.getImages(this.state.rentalId);
      });
  }

  render() {
    return (
      <Fragment>
        <Modal
          show={this.state.isOpen}
          toggleModal={this.toggleModal}
          header={this.state.header}
          body={this.state.body}
          footer={this.state.footer}
        />
        <NavBar
          loggedIn={this.props.loggedIn}
          admin={this.props.admin}
          logout={this.props.logout}
          location={this.props.location}
        />
        <div className="main-container">
          <ParallaxHero
            image={{ backgroundImage: 'url(https://images.unsplash.com/uploads/1412701079442fffb7c1a/6b7a62a4?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=63428fdde80191f1d2299d803dfe61c3&auto=format&fit=crop&w=1350&q=80)' }}
            title="Vandelay Rentals"
          />
          <div className='body-container'>
            <h1>Keith's Admin Test Page</h1>
            <DevLinks
              loggedIn={this.props.loggedIn}
              admin={this.props.admin}
              logout={this.props.logout}
              location={this.props.location}
            />

            <div className="category-btn-container">
              <button onClick={() => this.getByCategory("Paddleboard")}>PaddleBoards</button>
              <button onClick={() => this.getByCategory("Kayak")}>Kayaks</button>
              <button onClick={this.getAllRentals}>See All</button>
            </div>
            <div className="rentals-by-date-div">
              <form>
                <Input
                  value={this.state.date_from}
                  onChange={this.handleInputChange}
                  name="date_from"
                  type="text"
                  label="From:"
                />
                <Input
                  value={this.state.date_to}
                  onChange={this.handleInputChange}
                  name="date_to"
                  type="text"
                  label="To:"
                />
                <FormBtn
                  disabled={(
                    !this.state.date_from || !this.state.date_to
                  )}
                  onClick={this.handleDateSearch}
                >
                  Submit
                </FormBtn>
              </form>

            </div>

            <h2>Rentals:</h2>
            <div className="rental-results-div">
              {this.state.rentals ? this.state.rentals.map(rental => (

                <div id="rentalCard" className="rentalCard">
                  <div key={rental._id}>
                    <h3>{rental.name}</h3>
                    <h4>{rental.category}</h4>
                    <h5>Maker: {rental.maker}</h5>
                    <p>Daily rate: ${rental.rate}</p>
                  </div>
                  <div className="reservations-div">
                    {rental.reservations ? rental.reservations.map(res => (
                      <div className="reservation">
                        <p>From: {res.from}</p>
                        <p>To: {res.to}</p>
                      </div>
                    )) : null}
                  </div>
                </div>

              )) : null}
            </div>

          </div>


          <ParallaxHero
            image={{ backgroundImage: 'url(https://images.unsplash.com/photo-1499858476316-343e284f1f67?ixlib=rb-0.3.5&s=4985c13dbbf85d7d0f5b90df50ea8695&auto=format&fit=crop&w=1350&q=80)' }}
            title="About our Company"
          />

          <div className='body-container'>
            <p>Welcome{this.props.firstName ? `, ${this.props.firstName}` : ""}</p>
            <button
              onClick={() => this.setModal({
                header: "Kramer's Modal",
                body:
                  <img src="https://pbs.twimg.com/profile_images/966923121482645507/qtpVrqVn_400x400.jpg" alt="Kramer" />,
                footer: "Kramer's Modal Footer"
              })}
            >
              Kramer!
              </button>


            {this.state.images ? (
              <Fragment>
                <h2>Rental Images</h2>
                <ul>
                  {this.state.images.map(image => (
                    <li key={image._id}>
                      <p>image here:</p>
                      <img className="rental-img" src={`file/image/${image.filename}`} alt="rental condition" />
                      <button onClick={() => this.deleteImage(image._id)}>Delete</button>
                    </li>
                  ))}
                </ul>
              </Fragment>
            ) : null}


          </div>
          <Footer />
        </div>
      </Fragment>
    );
  }
}

export default Test;
