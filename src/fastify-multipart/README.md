# fastifyMmultipart

fork from @fastify/multipart@7.5.0
修改了默认行为，默认文件会直接消费并保存到本地临时文件夹下
然后会将路径等信息保存在request对象下的相应字段下。
所有文件的信息会另外挂在request对象下的requestFiles中