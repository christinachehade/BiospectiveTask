import React, { Component } from 'react';
import { connect } from 'react-redux'

class ListGrid extends Component {
    constructor(props) {
        super(props)
        this.state = {
            lists:[],
            itemsInput: ""
        }
    }
    componentDidMount() {
        setInterval(() => {
            fetch('./getAllLists')
                .then(res => { return res.text() })
                .then(response => {
                    let parsed = JSON.parse(response)
                    console.log(parsed)
                    this.setState({lists: parsed})
                    // this.props.dispatch({
                    //     type: "lists",
                    //     lists: parsed
                    // })
                })
        }, 500)
    }
    statusHandler=(id)=>{
        fetch('/completedList', {method: "POST", body: JSON.stringify({
            id: id
        })}).then(res=>{return res.text()})
        .then(response => {
            console.log(response)
        })
    }
    addItemHandler=(event)=>{
         this.setState({itemsInput: event.target.value})
    }

    itemSubmitHandler=(id)=>{
        fetch('/addItem', {method: "PUT", body: JSON.stringify({
            item: this.state.itemsInput,
            id: id
        })}).then(res=> {return res.text()})
        .then (response => {
            console.log(response.message)
        })
    }

    render() {
        return (<div>
            {this.state.lists.map((list,index) => {
                return (<div>
                    <div>{list.title}</div>
                    <div>{list.description}</div>
                    <div>{list.dueDate}</div>
                    <div>{list.items}</div>
                    <div>{list.createdAt}</div>
                    <div>{list.completedAt}</div>
                    <div>{list.updatedAt}</div>
                  
                    <button onClick={()=>this.statusHandler(list._id)}>{list.status}</button>

                        <input type="text" onChange={this.addItemHandler} ></input>
                        <button onClick={()=>this.itemSubmitHandler(list._id)}>Add item</button>
                
                </div>)
            })}
        </div>)
    }
}
let connectedListGrid = connect((store) => {
    return ({ lists: store.lists })
})(ListGrid)
export default connectedListGrid