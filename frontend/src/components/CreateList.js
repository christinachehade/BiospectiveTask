import React, { Component } from 'react';
import { connect } from 'react-redux'

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
        return (<div>
            <form onSubmit={this.submitHandler}>
                <input type="text" onChange={this.titleHandler} />
                <input type="text" onChange={this.descriptionHandler} />
                <input type="date" placeholder="YYYY-MM-DD" onChange={this.dueDateHandler} />
                <input type="submit" value="Create List" />
            </form>
        </div>
        )
    }
}
let connectedCreateList = connect()(CreateList)
export default connectedCreateList