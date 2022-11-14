import {React, Component} from 'react';
import ROSLIB from 'roslib';
import {Color} from 'three';

import ROS3D, {Viewer,OccupancyGridClient, OccupancyGridClientNav, UrdfClient, Pose, PointCloud2} from 'ros3d';
import {Ros} from 'roslib';
class Index extends Component{
    state={ navigationMode: false,
    };
    constructor(){
        super();
        this.init_connection=this.init_connection.bind(this);
        
    }
    
    b1Handler = (e) => {
      this.gridClient.currentGrid.navigator.toggleActivation();
      this.setState({navigationMode: this.gridClient.navigator.isActive});
    }

    componentDidMount(){
        this.init_connection();
        window.addEventListener('resize', (e) => (this.viewer.resize(window.innerWidth/2, window.innerHeight/2), true));
        // this.addEventListener('change', this.onMapChange);
    }

    init_connection() {
      this.ros = new ROSLIB.Ros({
        url : 'ws://localhost:9090',
      });

      // Create the main viewer.
      this.viewer = new Viewer({
        divID : 'map',
        width : 800,
        height : 600,
        antialias : true
      });



      this.tfClient = new ROSLIB.TFClient({
        ros : this.ros,
        angularThres : 0.01,
        transThres : 0.01,
        rate : 10.0,
        fixedFrame : "map"
      });
  
      // Setup the map client.
      this.gridClient = new OccupancyGridClientNav({
        ros : this.ros,
        rootObject : this.viewer.scene,
        tfClient: this.tfClient,
        // topic: '/move_base_flex/global_costmap/costmap',
        opacity: 0.8,
        // color : {r:255,g:0,b:0},   
        viewer: this.viewer,
        navServerName: '/nav_serv/move_to',
        navActionName: 'roamer_msgs/MoveBaseAction',
        navigatorInitState: this.state.navigationMode,
        continuous: true,
        
      });

      // this.localGridClient = new OccupancyGridClient({
      //   ros : this.ros,
      //   rootObject : this.viewer.scene,
      //   tfClient: this.tfClient,
      //   opacity: 0.5,
      //   // color : {r:255,g:0,b:0},   
      //   viewer: this.viewer,
      // });


      

      // Setup the URDF client.
      this.urdfClient = new UrdfClient({
          ros : this.ros,
          tfClient : this.tfClient,
          path : 'http://localhost:3000/',
          rootObject : this.viewer.scene,
          
      });
    //}

      var rospose = new Pose({
        ros : this.ros,
        topic : "/move_base_simple/goal",
        queue_length : 1,
        messageType : 'geometry_msgs/PoseStamped',
        rootObject : this.viewer.scene,
        tfClient : this.tfClient
      });

      this.lidar = new PointCloud2({
        ros: this.ros,
        topic: '/velodyne_points',
        tfClient: this.tfClient,
        rootObject: this.viewer.scene,
        colorsrc: 'z',
        // colormap: this.zAxisColorMapper,
        material: { color: 0xa83a32, 
                    size: 0.1,},


      });

      this.viewerCamera = this.viewer.cameraControls;
    }
    render(){
        //const map = this.init_connection();
        return(
            
            <div onLoad={this.init_connection}>
                <h1>Simple Map Example</h1>
                <div id="map"></div>
                <button onClick={this.b1Handler} >{this.state.navigationMode ? "NAV ACTIVE" : "NAV INACTIVE"}</button>
            </div>
        )
    }

    

    zAxisColorMapper(fieldVal){
      var minValue = -0.5;
      var maxValue = 0.5;
      var minMaxDiff = maxValue - minValue;
      // var colorList = [0x33FFFF, 0x8DD16E, 0x2596be, 0xFB9E00, 0xFB2424];
      var colorList = ['blue', 'green', 'yellow', 'orange', 'purple', 'red'];
      var rgb = {r: 0, g: 0, b:0};

      // normalize value to the givent range
      var normVal = (fieldVal - minValue)/ minMaxDiff
      if (normVal > 1.0){
        normVal = 1.0;
      } else if (normVal < 0.0){
        normVal = 0.0;
      }
      var idx = Math.round(normVal * (colorList.length -1));

      // var bigint = parseInt(colorList[idx], 16);
      // rgb.r = (bigint >> 16) & 255;
      // rgb.g = (bigint >> 8) & 255;
      // rgb.b = bigint & 255;
      rgb = new Color(colorList[idx]);

      return new Color(rgb);
    }

}
export default Index;
