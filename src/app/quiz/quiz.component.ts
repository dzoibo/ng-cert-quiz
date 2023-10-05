import {Component, inject, Input} from '@angular/core';
import { Question} from '../data.models';
import {QuizService} from '../quiz.service';
import {Router} from '@angular/router';
import { first } from 'rxjs';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent {

  @Input()
  questions: Question[] | null = [];
  @Input()
  difficulty!: any;
  @Input()
  categoryId!: string;
  userAnswers: string[] = [];
  quizService = inject(QuizService);
  router = inject(Router);
  isQuestionChanged=false;

  submit(): void {
    this.quizService.computeScore(this.questions ?? [], this.userAnswers);
    this.router.navigateByUrl("/result");
  }

  changeQuestion(index: number){
    this.isQuestionChanged=true;
    this.quizService.createQuiz(this.categoryId,this.difficulty).pipe(first()).subscribe(value=>{
      if (this.questions)
      this.questions[index]=value[0];
    })
  }

}
