# Mark location of self so that robot_upstart knows where to find the setup file.
export ROBOT_SETUP=/etc/ros/setup.bash

# Setup robot upstart jobs to use the IP from the network bridge.
# export ROBOT_NETWORK=br0

# Load the robot's model type and serial number
source /etc/clearpath-serial.bash

# Insert extra platform-level environment variables here. The six hashes below are a marker
# for scripts to insert to this file.
######

# Pass through to the main ROS workspace of the system.
source /opt/ros/noetic/setup.bash

# If you have a catkin workspace, source it below. e.g.
source /home/administrator/catkin_ws/devel/setup.bash

# Any additional environment variables that depend on your workspace should be exported here
export HUSKY_URDF_EXTRAS=/home/administrator/catkin_ws/src/jhic01_husky/urdf/jhic01_husky.urdf.xacro

export HUSKY_IMU_XYZ='0 -0.15 0.065'
export HUSKY_IMU_RPY='3.1415 0 0'



