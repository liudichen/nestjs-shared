import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**从请求中或取fastifyFile文件数组的装饰器(如果传递某个fieldname参数则必须设置@iimm/fastify-multpart的参数attachFileToBody=false) */
export const FastifyFiles = createParamDecorator(
  (field: string, ctx: ExecutionContext) => {
    const reqest = ctx.switchToHttp().getRequest();
    return reqest[field || 'requestFiles'];
  },
);
