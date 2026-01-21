import type { RequestHandler } from "express";

type AsyncRequestHandler<Params, ResBody, ReqBody, ReqQuery> = RequestHandler<
  Params,
  ResBody,
  ReqBody,
  ReqQuery
>;

export function asyncHandler<Params, ResBody, ReqBody, ReqQuery>(
  handler: AsyncRequestHandler<Params, ResBody, ReqBody, ReqQuery>,
): AsyncRequestHandler<Params, ResBody, ReqBody, ReqQuery> {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}
