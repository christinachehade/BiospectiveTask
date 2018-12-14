import React, { Component } from 'react';
import { connect } from 'react-redux'
import'../App.css'

class ListGrid extends Component {
    constructor(props) {
        super(props)
        this.state = {
            newInput:"",
            itemIndex:"",
            listId: "",
            flag:false,
            lists:[],
            itemsInput: "",
            sortingType:""
        }
    }
    componentDidMount() {
        setInterval(() => {
            fetch('./getAllLists',{method:"POST",body: JSON.stringify({
                sortingType: this.state.sortingType
            })}).then(res => { return res.text() })
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

    removeItemHandler=(index, id)=>{
        fetch('/removeItem', {method: "DELETE", body: JSON.stringify({
            index: index,
            id: id
        })}).then(res=>{return res.text()})
        .then(response=>{
            console.log(response)
        })
    }
editItemHandler =(id, index)=>{
    this.setState({flag: true, listId:id, itemIndex: index})
}

changedItemHandler=(event)=>{
    this.setState({newInput: event.target.value})
}
saveChangedHandler=(id, index)=>{
    fetch('/editItem', {method: "PUT", body: JSON.stringify({
        id: id,
        index: index, 
        newInput: this.state.newInput
    })}).then(res=>{return res.text()})
    .then(response=>{
        console.log(response)
    })
}

removeAllHandler=(id)=>{
    fetch('/removeAllItems', {method: "DELETE", body: JSON.stringify({
        id: id
    })}).then(res=>{return res.text()})
    .then(response=>{
        console.log(response)
    })
}
removeListHandler=(id)=>{
    fetch('/removeList', {method: "DELETE", body: JSON.stringify({
        id: id
    })}).then(res=>{return res.text()})
    .then(response=>{
        console.log(response)
    })
}
sortByDueDate=()=>{
    this.setState({sortingType: "dueDate"})
}
sortByTitle=()=>{
    this.setState({sortingType:"title"})
}
    render() {
        let editform = null
        if (this.state.flag){
            editform = (<div>
                <input onChange={this.changedItemHandler} type="text"/>
                <button onClick= {()=>this.saveChangedHandler(this.state.listId, this.state.itemIndex)}>save</button>
            </div>)
        }
        return (<div>
            <div className="sort-nav">
            <div>Sort By:</div>
            <button className="buttons"onClick={this.sortByDueDate}>Due Date</button>
            <button className="buttons" onClick={this.sortByTitle}>Title</button>
            </div>
            {this.state.lists.map((list) => {
                return (<div className="list-container">
                    <div>{list.title}</div>
                    <div>{list.description}</div>
                    <div>Due Date:{list.dueDate}</div>
                    <div>{list.items.map((item,index)=>{
                        return(<div>
                            <div>{item}</div>
                            <button className="buttons" onClick={()=>this.removeItemHandler(index, list._id)}>remove item</button>
                            <button className="buttons" onClick={()=>this.editItemHandler(list._id,index)}>edit item</button>
                        </div>)
                        
                    })}</div>
                    
                    <div>Created At:{list.createdAt}</div>
                    <div>Completed At:{list.completedAt}</div>
                    <div>Updated At:{list.updatedAt}</div>
                  
                    <button onClick={()=>this.statusHandler(list._id)}>{list.status}</button>
                        <div className="add-item">
                        <input className="input" type="text" onChange={this.addItemHandler} ></input>
                        <button className="buttons" onClick={()=>this.itemSubmitHandler(list._id)}>Add item</button>
                        </div>
                        <button className="buttons" onClick={()=>this.removeAllHandler(list._id)}>Remove All Items</button>
                        <button className="buttons"onClick={()=>this.removeListHandler(list._id)}>Remove List</button>
                    
                </div>)
            })}
             <div>{editform}</div>
        </div>)
    }
}
let connectedListGrid = connect((store) => {
    return ({ lists: store.lists })
})(ListGrid)
export default connectedListGrid