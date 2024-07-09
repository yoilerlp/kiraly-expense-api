import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IResponseData } from '../interface/response';

@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, IResponseData<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IResponseData<T>> {
    return next.handle().pipe(map((data) => ({ data })));
  }
}
