import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import qs from 'qs';

/**从请求中或取fastifyFile文件数组的装饰器(如果传递某个fieldname参数则必须设置@iimm/fastify-multpart的参数attachFileToBody=false) */
export const FastifyFiles = createParamDecorator(
  (field: string, ctx: ExecutionContext) => {
    const reqest = ctx.switchToHttp().getRequest();
    return reqest[field || 'requestFiles'];
  },
);

/**获取经过passport-jwt校验后挂载的request.user内容或其中的某个属性值 */
export const JwtUser = createParamDecorator(
  (prop: string, ctx: ExecutionContext) => {
    const { user } = ctx.switchToHttp().getRequest();
    return prop ? user?.[prop] : user;
  },
);

export const deserialize = (value: any) => {
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch (error) {
    return value;
  }
};

/**用JSON.parse反序列化后的body上的属性(如果不传属性名不会尝试反序列化直接返回body，但可以传数组属性名，此时返回整个body并反序列化数组中的属性) */
export const DeserializedBody = createParamDecorator(
  (prop: string | string[], ctx: ExecutionContext) => {
    const body: Record<string, any> =
      ctx.switchToHttp().getRequest<FastifyRequest>().body || {};
    if (!prop) return body;
    if (Array.isArray(prop)) {
      const data = { ...body };
      for (const att of prop) {
        if (att in data) {
          data[att] = deserialize(data[att]);
        }
      }
      return data;
    }
    return deserialize(body?.[prop]);
  },
);

export const QsRequestParams = createParamDecorator(
  (field: string | string[], ctx: ExecutionContext) => {
    const url = ctx.switchToHttp().getRequest<FastifyRequest>().url;
    const index = url.indexOf('?');
    const params: Record<string, any> =
      qs.parse(index === -1 ? '' : url.slice(index + 1)) || {};
    if (!field) return params;
    if (Array.isArray(field)) {
      const data: Record<string, any> = {};
      for (const fd of field) {
        data[fd] = params?.[fd];
      }
      return data;
    }
    return params?.[field];
  },
);
