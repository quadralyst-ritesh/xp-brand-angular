import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  public currentQuestionCount = 0;

  constructor(
    private surveyApiService: SurveyApiService,
    private activatedRoute: ActivatedRoute,
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

      const paramsObj = {
        fs_uuid: fsUuid,
        no_of_question: noOfQuestion,
        fs_surveyid: fsSurveyId,
        que: que,
        next_question: nextQuestion,
        return_url: returnUrl,
        uuid: uuid,
      }

      if(this.allValuesPresent(paramsObj)){
        this.paramsData = paramsObj;
        this.isLoading = true;
        console.log('Params data: ', paramsObj);
        this.startConversation(paramsObj);
      }
    });
  }


  private startConversation(paramsObj: any){
    this.surveyApiService.callStartConversation(paramsObj).subscribe(response => {
      console.log('Response of start: ', response);
      if(response && response.thread_id){
        this.surveyResponse = response;
        this.currentQuestionCount = 1;
        this.isLoading = false;
      }
    }, error => {
      console.error('Error', error);
    })
  }

  // public submit(){
  //   this.isLoading = true;
  //   if(this.paramsData.no_of_question !== 1){
  //     this.paramsData.no_of_question--
  //   }

  //   this.surveyApiService.submitConversation(this.surveyResponse.thread_id, this.userResponseMessage).subscribe(res => {
  //     console.log('After user submit respose: ', res)
  //     if(res){
  //       this.userResponseMessage = '';
  //       this.isLoading = false;

  //       if(this.paramsData.no_of_question === 1){

  //         /* Navigate to return URL from first response */

  //       }else {
  //         this.surveyResponse.assistant_response = res.assistant_response;
  //       }
  //     }
  //   }, error => {
  //     console.error('Error', error);
  //   })
  // }

  public submit(): void {
    this.isLoading = true;  
    this.surveyApiService.submitConversation(this.surveyResponse.thread_id, this.userResponseMessage)
      .subscribe(
        res => this.handleSuccessfulSubmission(res),
        error => {
        console.error('Error', error);
        }
      );
  }
  
  private handleSuccessfulSubmission(response: any): void {
    console.log('After user submit response: ', response);
    if (response) {
      this.userResponseMessage = '';
      this.isLoading = false;
      
      if (Number(this.paramsData.no_of_question) === Number(this.currentQuestionCount)) {
        this.redirectToUrl();
      } else {
        this.currentQuestionCount++;
        this.surveyResponse.assistant_response = response.assistant_response;
      }
    }
  }

  redirectToUrl() {
    const url = this.paramsData.return_url;
    // window.open(url, '_blank');
    window.location.replace(url);
  }

  private allValuesPresent(obj: any) {
    const values = Object.values(obj);
    return values.every(value => !!value);
  }
}
