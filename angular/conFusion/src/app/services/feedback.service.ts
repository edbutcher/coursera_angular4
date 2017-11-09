import { Injectable } from '@angular/core';

import { ProcessHTTPMsgService } from './process-httpmsg.service';
import { Feedback } from '../shared/feedback';

import { RestangularModule, Restangular } from 'ngx-restangular';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map'

@Injectable()
export class FeedbackService {

  constructor(private restangular: Restangular,
            private processHTTPMsg: ProcessHTTPMsgService) { }

submitFeedback(feed: Feedback): Observable<Feedback[]> {

  console.log(feed);
  return this.restangular.all('feedback').post(feed);
}


}
