let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let ToDoListSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  status: {
    type: String,
    default:"active",
    required: false
  },

  dueDate: {
    type: Date,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    required: false
  },
  updatedAt: {
    type: Date,
    required: false
  },
  completedAt: {
    type: Date,
    required: false
  },
  items: {
      type:Array,
      default:[],
      required:false
  }
});

module.exports = mongoose.model("ToDoList", ToDoListSchema);
