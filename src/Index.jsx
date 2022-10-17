import {React, Component} from 'react';
// import ROSLIB from 'roslib';

// import {Viewer,OccupancyGridClient} from 'ros3d';
// import {Ros} from 'roslib';
class Index extends Component{
    state={

    };
    constructor(){
        super();
        this.init_connection=this.init_connection.bind(this)
    }

    componentDidMount(){
        this.init_connection()
    }

    init_connection() {
        var ros = new window.ROSLIB.Ros({
            url : 'ws://localhost:9090'
        });

         // Create the main viewer.
        var viewer = new window.ROS3D.Viewer({
        divID : 'map',
        width : 800,
        height : 600,
        antialias : true
      });
  
      // Setup the map client.
      var gridClient = new window.ROS3D.OccupancyGridClient({
        ros : ros,
        rootObject : viewer.scene,
        // color : {r:255,g:0,b:0}
      });
    //}
    }
    render(){
        //const map = this.init_connection();
        return(
            
            <div onLoad={this.init_connection}>
                <h1>Simple Map Example</h1>
                <div id="map"></div>
            </div>
        )
    }
}
export default Index;
