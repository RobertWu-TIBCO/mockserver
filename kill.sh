#!/bin/bash --login
#成为login shell，才能读取.bashrc的Alias设置
#=====================
#YuanHui.HE
#khler@163.com
#=====================
shopt -s expand_aliases
#使用shell内置命令shopt命令来开启alias扩展选项
echo Current NODE_ENV : $NODE_ENV , PORT : $PORT
mock_ps=$(netstat -anot |grep :|grep -m1 $PORT)
echo kill mock_ps $mock_ps
mock_pid=$(netstat -anot |grep :|grep -m1 $PORT|awk '{print $5}')
echo kill mock_pid $mock_pid
echo kill9 $mock_pid
