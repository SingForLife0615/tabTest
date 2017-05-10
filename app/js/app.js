import React,{Component} from "react";
import {render} from "react-dom";
import {TabComponent} from "./component/tab.js";


document.addEventListener('DOMContentLoaded',()=>{
    render(<TabComponent/>,document.getElementById('content'));
})