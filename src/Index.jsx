import {React, Component} from 'react';
import ROSLIB from 'roslib';

import ROS3D, {Viewer,OccupancyGridClient, OccupancyGridClientNav, UrdfClient, Pose} from 'ros3d';
import {Ros} from 'roslib';
class Index extends Component{
    state={ ros: null,
            viewer: null,
            tfClient: null,
            gridClient: null,
            navigationMode: true,
    };
    constructor(){
        super();
        this.init_connection=this.init_connection.bind(this)
    }

    componentDidMount(){
        this.init_connection();
        // this.addEventListener('change', this.onMapChange);
    }

    init_connection() {
    
      this.state.ros = new ROSLIB.Ros({
          url : 'ws://localhost:9090'
      });

         // Create the main viewer.
      this.viewer = new Viewer({
        divID : 'map',
        width : 800,
        height : 600,
        antialias : true
      });


      this.tfClient = new ROSLIB.TFClient({
        ros : this.state.ros,
        angularThres : 0.01,
        transThres : 0.01,
        rate : 10.0,
        fixedFrame : "/map"
      });
  
      // Setup the map client.
      this.gridClient = new OccupancyGridClientNav({
        ros : this.state.ros,
        rootObject : this.viewer.scene,
        tfClient: this.tfClient,
        // opacity: 1.0,
        // color : {r:255,g:0,b:0},   
        viewer: this.viewer,
        navServerName: '/nav_serv/move_to',
        navActionName: 'roamer_msgs/MoveBaseAction',
      });

      // viewer.addObject(gridClient.currentGrid, true);

      

      // Setup the URDF client.
      this.urdfClient = new UrdfClient({
          ros : this.state.ros,
          tfClient : this.tfClient,
          path : 'http://localhost:3000/',
          rootObject : this.viewer.scene,
          
      });
    //}

      var rospose = new Pose({
        ros : this.state.ros,
        topic : "/move_base_simple/goal",
        queue_length : 1,
        messageType : 'geometry_msgs/PoseStamped',
        rootObject : this.viewer.scene,
        tfClient : this.tfClient
      });

      this.viewerCamera = this.viewer.cameraControls;
    }
    render(){
        //const map = this.init_connection();
        return(
            
            <div onLoad={this.init_connection}>
                <h1>Simple Map Example</h1>
                <div id="map"></div>
                <button onClick={this.b1Handler.bind(this)} >NAV is ACTIVE</button>
            </div>
        )
    }

    b1Handler(e){
      this.gridClient.currentGrid.navigator.toggleActivation();
      if (this.gridClient.currentGrid.navigator.isActive){
        e.target.textContent = 'NAV is ACTIVE';
      } else{
        e.target.textContent = 'NAV is INACTIVE';
      }
    }


}
export default Index;
