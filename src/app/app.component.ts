import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SurveyApiService } from './api-service/survey-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'xp-brand.ai';

  public surveyResponse: any;
  public isLoading = true;
  public paramsData: any;
  public userResponseMessage = '';

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

      if(this.allValuesPresent(surveyObj)){
        this.paramsData = surveyObj;
        this.isLoading = true;
        this.startConversation(surveyObj);
      }
    });
  }


  private startConversation(surveyObj: any){
    this.surveyApiService.callStartConversation(surveyObj).subscribe(response => {
      console.log('Response of start: ', response);
      if(response && response.thread_id){
        this.surveyResponse = response;
        this.isLoading = false;
      }
    }, error => {
      console.error('Error', error);
    })
  }

  public submit(){
    this.isLoading = true;
    this.paramsData.no_of_question--
    this.surveyApiService.submitConversation(this.surveyResponse.thread_id, this.userResponseMessage).subscribe(res => {
      console.log('After user submit respose: ', res)
      if(res){
        this.surveyResponse.assistant_response = res.assistant_response;
        this.userResponseMessage = '';
        this.isLoading = false;
      }
    }, error => {
      console.error('Error', error);
    })
  }

  private allValuesPresent(obj: any) {
    const values = Object.values(obj);
    return values.every(value => !!value);
  }
}
