import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable, tap} from 'rxjs';
import {Category, Difficulty, ApiQuestion, Question, Results, DetailledCategory} from './data.models';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  private API_URL = "https://opentdb.com/";
  private latestResults!: Results;

  constructor(private http: HttpClient) {
  }

  getAllCategories(): Observable<DetailledCategory[]> {
    return this.http.get<{ trivia_categories: Category[] }>(this.API_URL + "api_category.php").pipe(
      map(res => this.mapSubCategorie(res.trivia_categories))
    );
  }

  createQuiz(categoryId: string, difficulty: Difficulty): Observable<Question[]> {
    return this.http.get<{ results: ApiQuestion[] }>(
        `${this.API_URL}/api.php?amount=5&category=${categoryId}&difficulty=${difficulty.toLowerCase()}&type=multiple`)
      .pipe(
        map(res => {
          const quiz: Question[] = res.results.map(q => (
            {...q, all_answers: [...q.incorrect_answers, q.correct_answer].sort(() => (Math.random() > 0.5) ? 1 : -1)}
          ));
          return quiz;
        })
      );
  }

  computeScore(questions: Question[], answers: string[]): void {
    let score = 0;
    questions.forEach((q, index) => {
      if (q.correct_answer == answers[index])
        score++;
    })
    this.latestResults = {questions, answers, score};
  }

  getLatestResults(): Results {
    return this.latestResults;
  }
  
  mapSubCategorie(categories: Category[]) {
    let detailledCategoryList: DetailledCategory[]=[];
    let j=0
    while(j<categories.length){
      const detailledCategory=new DetailledCategory();
      detailledCategory.id=categories[j].id;
      detailledCategory.name=categories[j].name;
      const splitedCategory=detailledCategory.name.split(':');
      if(splitedCategory.length>1){
        detailledCategory.name=splitedCategory[0];
        let i=0;
        while(i<categories.length){
          const position=categories[i].name.indexOf(splitedCategory[0]+':');
           if(position===0){
            detailledCategory.subCategories.push(categories[i].name.split(':')[1])
              categories.splice(i,1);
              i--;
           }
           i++;
        }
        j--
      }else{
        detailledCategory.subCategories=[];
      }
      j++
      detailledCategoryList.push(detailledCategory);
    }
    return detailledCategoryList;
  }

}
