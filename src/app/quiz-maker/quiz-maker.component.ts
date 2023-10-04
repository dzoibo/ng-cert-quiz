import {Component} from '@angular/core';
import {Category, DetailledCategory, Difficulty, Question} from '../data.models';
import {Observable} from 'rxjs';
import {QuizService} from '../quiz.service';

@Component({
  selector: 'app-quiz-maker',
  templateUrl: './quiz-maker.component.html',
  styleUrls: ['./quiz-maker.component.css']
})
export class QuizMakerComponent {

  categories: DetailledCategory[]=[];
  questions$!: Observable<Question[]>;
  subCategories: string[]=[];

  constructor(protected quizService: QuizService) {
    quizService.getAllCategories().subscribe(value=>{
      this.categories=value;
    });
  }

  createQuiz(cat: string, difficulty: string): void {
    this.questions$ = this.quizService.createQuiz(cat, difficulty as Difficulty);
  }


  getSubcategories(id: string){
    this.subCategories=[];
    const index=this.categories.findIndex(category=>category.id.toString()===id);
    this.subCategories=this.categories[index].subCategories;
  }
}
