import React, { Component } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import Checkbox from "./Checkbox";
import "react-datepicker/dist/react-datepicker.css";

const OPTIONS = ["Java", "C++", "Python", "Ruby", "Rust", "C", "Objective C", "Swift", "Go", "Kotlin"];
export default class EditUser extends Component {
  constructor(props) {
    super(props);

    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeDuration = this.onChangeDuration.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeSkills  = this.onChangeSkills.bind(this);

    this.state = {
      username: '',
      description: '',
      duration: 0,
      date: new Date(),
      skills: OPTIONS.reduce(
        (options, option) => ({
          ...options,
          [option]: false
        }),
        {}
      )
    }
  }

  componentDidMount() {
    axios.get('http://localhost:5000/users/'+this.props.match.params.id)
      .then(response => {
          const skillMap = new Map();
          OPTIONS.forEach(
            (item, index) => {
              skillMap[item] =  false;
            }
          );
          JSON.parse(response.data.skills).forEach(
            (item, index) => {
              skillMap[item] =  true;
            }
          );
          console.log("test" +JSON.stringify(skillMap));
          this.setState({
          username: response.data.username,
          description: response.data.description,
          duration: response.data.duration,
          date: new Date(response.data.date),
          skills: skillMap,
          
        })   
      })
      .catch(function (error) {
        console.log(error);
      })

  }

  onChangeUsername(e) {
    this.setState({
      username: e.target.value
    })
  }

  onChangeDescription(e) {
    this.setState({
      description: e.target.value
    })
  }

  onChangeDuration(e) {
    this.setState({
      duration: e.target.value
    })
  }

  onChangeDate(date) {
    this.setState({
      date: date
    })
  }

  onChangeSkills = changeEvent => {
    const { name } = changeEvent.target;

    this.setState(prevState => ({
      skills: {
        ...prevState.skills,
        [name]: !prevState.skills[name]
      }
    }));
  };

  createCheckbox = option => (
    <Checkbox
      label={option}
      isSelected={this.state.skills[option]}
      onCheckboxChange={this.onChangeSkills}
      key={option}
    />
  );

  createCheckboxes = () => OPTIONS.map(this.createCheckbox);

  onSubmit(e) {
    e.preventDefault();

    const user = {
      username: this.state.username,
      description: this.state.description,
      duration: this.state.duration,
      date: this.state.date,
      skills: JSON.stringify(Object.keys(this.state.skills).filter(skill => this.state.skills[skill]))
    }

    console.log(user);

    axios.post('http://localhost:5000/users/update/' + this.props.match.params.id, user)
      .then(res => console.log(res.data));

    window.location = '/';
  }

  render() {
    return (
    <div>
      <h3>Edit User Log</h3>
      <form onSubmit={this.onSubmit}>
        <div className="form-group"> 
          <label>Name: </label>
          <input  type="text"
              required
              className="form-control"
              value={this.state.username}
              onChange={this.onChangeUsername}
              />
        </div>
        <div className="form-group"> 
          <label>Description: </label>
          <input  type="text"
              required
              className="form-control"
              value={this.state.description}
              onChange={this.onChangeDescription}
              />
        </div>
        <div className="form-group">
          <label>Duration (in minutes): </label>
          <input 
              type="text" 
              className="form-control"
              value={this.state.duration}
              onChange={this.onChangeDuration}
              />
        </div>
        <div className="form-group">
          <label>Date: </label>
          <div>
            <DatePicker
              selected={this.state.date}
              onChange={this.onChangeDate}
            />
          </div>
        </div>
        {this.createCheckboxes()}

        <div className="form-group">
          <input type="submit" value="Edit User Log" className="btn btn-primary" />
        </div>
      </form>
    </div>
    )
  }
}