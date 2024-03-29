import { ErrorCode } from '@rps/bullion-interfaces';
import { RESTApiReqError } from '../rest-api-req.error';

export class InvalidTokenSignature extends RESTApiReqError {
  constructor() {
    super(ErrorCode.INVALID_TOKEN_SIGNATURE, 'Invalid Token Signature');
  }
}
