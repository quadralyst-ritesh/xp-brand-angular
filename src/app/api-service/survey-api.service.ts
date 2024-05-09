import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SurveyApiService {

  constructor(
    private http: HttpClient
  ) { }

  public callStartConversation(surveyObj: any): Observable<any> {
    const url = `https://survey.xpbrand.ai/start_conversation?fs_uuid=${surveyObj.fs_uuid}&no_of_question=${surveyObj.no_of_question}&fs_surveyid=${surveyObj.fs_surveyid}&que=${surveyObj.que}&next_question=${surveyObj.next_question}?&return-url=${surveyObj.return_url}`;
    console.log('Url: ', url)
    return this.http.post(url, null);
  }
}
