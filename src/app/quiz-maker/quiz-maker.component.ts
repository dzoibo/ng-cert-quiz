import {Component, ViewChild} from '@angular/core';
import {Category, DetailledCategory, Difficulty, Question} from '../data.models';
import {Observable} from 'rxjs';
import {QuizService} from '../quiz.service';

@Component({
  selector: 'app-quiz-maker',
  templateUrl: './quiz-maker.component.html',
  styleUrls: ['./quiz-maker.component.css']
})
export class QuizMakerComponent {
  inputFilter='';
  categories: DetailledCategory[]=[];
  categoryId=0;
  filteredCategories: DetailledCategory[]=[];
  questions$!: Observable<Question[]>;
  subCategories: string[]=[];
  displaySelect=false;

  constructor(protected quizService: QuizService) {
    quizService.getAllCategories().subscribe(value=>{
      this.categories=value;
      this.filteredCategories=value;
    });
  }

  createQuiz(cat: string, difficulty: string): void {
    this.questions$ = this.quizService.createQuiz(cat, difficulty as Difficulty);
  }


  getSubcategories(id: number){
    this.displaySelect=false;
    this.categoryId=id;
    this.subCategories=[];
    const index=this.categories.findIndex(category=>category.id===id);
    this.subCategories=this.categories[index].subCategories;
    this.inputFilter=this.categories[index].name;
  }

  filterCategories(){
    let categoriesCopy:DetailledCategory[]=[];
    for(const item of this.categories){
      categoriesCopy.push({...item})
    }
    if(this.inputFilter.trim().length>0){
      this.filteredCategories=categoriesCopy.filter(category=>category.name.toUpperCase().includes(this.inputFilter.toUpperCase()));
      for(const category of this.filteredCategories){
        category.name=category.name.toLowerCase().replaceAll(this.inputFilter.toLowerCase(),'<b>'+this.inputFilter.toLowerCase()+'</b>');
      }
    }else{
      this.filteredCategories=categoriesCopy;
    }

    this.displaySelect=true;

  }

}
