import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SurveyApiService } from './api-service/survey-api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'survey-application';

  private subscriptions: Subscription[] = [];

  constructor(
    private surveyApiService: SurveyApiService,
    private activatedRoute: ActivatedRoute
  ){

  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      const fsUuid = params['fs_uuid'];
      const noOfQuestion = params['no_of_question'];
      const fsSurveyId = params['fs_surveyid'];
      const que = params['que'];
      const nextQuestion = params['next_question'];
      const returnUrl = params['return-url'];
      const uuid = params['uuid'];

      const surveyObj = {
        fs_uuid: fsUuid,
        no_of_question: noOfQuestion,
        fs_surveyid: fsSurveyId,
        que: que,
        next_question: nextQuestion,
        return_url: returnUrl,
        uuid: uuid,
      }
      this.startConversation(surveyObj)
    });
  }


  private startConversation(surveyObj: any){
    console.log('surveyObj: ', surveyObj);
    this.surveyApiService.callStartConversation(surveyObj).subscribe(response => {
      console.log('Response of start: ', response);
    })
  }
}
