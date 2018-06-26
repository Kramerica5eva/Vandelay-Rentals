import React, { Component } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import API from "../../utils/API";
import Modal from "../../components/Modal";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import ParallaxHero from "../../components/ParallaxHero"
import { Input, FormBtn } from "../../components/Form";
import "./Test.css";

class Test extends Component {
  state = {
    isOpen: false,
    header: "",
    body: "",
    footer: "",
    rentals: [],

    // testing photo uploads...
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

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleFormSubmit = event => {
    event.preventDefault();
    //  blah blah blah
  };

  // testing photo uploads...
  fileSelectedHandler = event => {
    const newFile = event.target.files[0];
    this.setState({
      selectedFile: newFile
    });
  }
  // testing photo uploads...
  handleUpload = event => {
    event.preventDefault();
    const fd = new FormData();
    fd.append('file', this.state.selectedFile, this.state.selectedFile.name);
    API.uploadImage(fd).then(res => console.log(res));
    console.log(fd);
  }

  render() {
    return (
      <React.Fragment>
        <NavBar
          toggleModal={this.props.toggleModal}
          setModal={this.props.setModal}
          updateUser={this.props.updateUser}
          loggedIn={this.props.loggedIn}
          firstName={this.props.firstName}
          admin={this.props.admin}
          logout={this.props.logout}
        />
        <div className="main-container">
          <ParallaxHero
            image={{ backgroundImage: 'url(https://images.unsplash.com/uploads/1412701079442fffb7c1a/6b7a62a4?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=63428fdde80191f1d2299d803dfe61c3&auto=format&fit=crop&w=1350&q=80)' }}
            title="Vandelay Rentals"
          />
          <Modal
            show={this.state.isOpen}
            toggleModal={this.toggleModal}
            header={this.state.header}
            body={this.state.body}
            footer={this.state.footer}
          />
          <div className='body-container'>
            <h1>Vandelay Test Page, Nomsayn?</h1>
            <h2>A Page for Testing Components</h2>
            <h2>(showing Rental results for dev purposes)</h2>
            <div className="nav-container">
              <Link className="btn-link" to="/" role="button">Home</Link>
              <Link className="btn-link" to="/rentals" role="button">Rentals</Link>
              <Link className="btn-link" to="/sales" role="button">Sales</Link>
              <Link className="btn-link" to="/courses" role="button">Courses</Link>
              {this.props.loggedIn ? (
                <button className="btn-link" onClick={this.props.logout}>logout</button>
              ) : (
                  <React.Fragment>
                    <Link className="btn-link" to="/signup" role="button">Signup</Link>
                    <Link className="btn-link" to="/login" role="button">Login</Link>
                  </React.Fragment>
                )}
              <Link className="btn-link" to="/test" role="button">Test</Link>
              <Link className="btn-link" to="/testnick" role="button">TestNick</Link>
              <Link className="btn-link" to="/testben" role="button">TestBen</Link>
              {this.props.admin ? <Link className="btn-link" to="/admin" role="button">Admin</Link> : null}
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



            {/* {testing photo uploads...} */}
            <h2>File Uploads</h2>
            <form encType="multipart/form-data">
              <Input
                type="file"
                name="file"
                label="Upload an image"
                onChange={this.fileSelectedHandler}
              />
              <FormBtn
                onClick={this.handleUpload}
              >
                Submit
              </FormBtn>
            </form>


            <h2>Rentals Available:</h2>
            <ul>
              {this.state.rentals.map(rental => (
                <li key={rental._id}>
                  <h3>{rental.name}</h3>
                  <button onClick={() => this.setModal({
                    header: rental.name,
                    body:
                      <div>
                        <h4>{rental.category}</h4>
                        <h5>Maker: {rental.maker}</h5>
                        <p>Daily rate: ${parseFloat(rental.dailyRate.$numberDecimal).toFixed(2)}</p>
                      </div>,
                    footer: rental.name
                  })}>
                    see details
                    </button>
                </li>
              ))}
            </ul>
          </div>
          <Footer />
        </div>
      </React.Fragment>
    );
  }
}

export default Test;
