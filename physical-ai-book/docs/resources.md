# Resources & Tools

## Essential Software Stack

### Simulation Environments

| Tool | Purpose | Learning Curve | Best For |
|------|---------|----------------|----------|
| **Gazebo** | Physics simulation | Medium | General robotics, sensor simulation |
| **NVIDIA Isaac Sim** | Photorealistic simulation | High | AI training, computer vision |
| **PyBullet** | Physics simulation | Low | Reinforcement learning research |
| **Unity** | High-fidelity rendering | Medium | Human-robot interaction |
| **Webots** | Educational simulation | Low | Beginners, academic use |

### Middleware & Frameworks

| Framework | Language | Purpose | Documentation |
|-----------|----------|---------|---------------|
| **ROS 2** | C++/Python | Robot middleware | [docs.ros.org](https://docs.ros.org) |
| **PyTorch** | Python | Deep learning | [pytorch.org](https://pytorch.org) |
| **TensorFlow** | Python | ML deployment | [tensorflow.org](https://tensorflow.org) |
| **OpenCV** | C++/Python | Computer vision | [opencv.org](https://opencv.org) |
| **MoveIt 2** | C++/Python | Motion planning | [moveit.ros.org](https://moveit.ros.org) |

### Development Tools

```bash
# Recommended development environment setup
conda create -n physical-ai python=3.9
conda activate physical-ai
pip install torch torchvision torchaudio
pip install opencv-python numpy pandas matplotlib
pip install gymnasium stable-baselines3
pip install jupyterlab ipywidgets