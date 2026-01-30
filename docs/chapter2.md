# Chapter 2: ROS 2 Fundamentals

## Introduction to ROS 2
ROS (Robot Operating System) is not an actual operating system but a middleware framework for robot software development.

## Core Concepts

### Nodes
Nodes are processes that perform computation. Each node should be responsible for a single, modular purpose.

```python
# Example ROS 2 Node in Python
import rclpy
from rclpy.node import Node

class MyNode(Node):
    def __init__(self):
        super().__init__('my_node')
        self.get_logger().info('Node started!')

def main():
    rclpy.init()
    node = MyNode()
    rclpy.spin(node)
    rclpy.shutdown()