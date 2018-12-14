import React, { Component } from 'react';
import { connect } from 'react-redux'
import '../App.css'

class CreateList extends Component {
    constructor() {
        super()
        this.state = {
            title: '',
            description: '',
            dueDate: ''
        }
    }

    titleHandler = (event) => {
        this.setState({ title: event.target.value })
    }
    descriptionHandler = (event) => {
        this.setState({ description: event.target.value })
    }
    dueDateHandler = (event) => {
        this.setState({ dueDate: event.target.value })
    }
    
    submitHandler = (event) => {
        event.preventDefault()
        fetch("/createList", {
            method: "put", body: JSON.stringify({
                title: this.state.title,
                description: this.state.description,
                dueDate: this.state.dueDate
            })

        }).then((x) => { return x.text() })
            .then(res => {
                console.log(res)
            })

    }

    render() {
        return (<div className ="todo-form">
        <th>Add A Todo List</th>
            <form onSubmit={this.submitHandler}>
                <th>Title:</th>
                <input type="text" onChange={this.titleHandler}/>
                <th>Description:</th>
                <textarea rows="4" cols="47" type="textarea" onChange={this.descriptionHandler} />
                <th>Due Date:</th>
                <input type="date" placeholder="YYYY-MM-DD" onChange={this.dueDateHandler} />
                <div>
                <input type="submit" value="Create List" />
                </div>
            </form>
        </div>
        )
    }
}
let connectedCreateList = connect()(CreateList)
export default connectedCreateList