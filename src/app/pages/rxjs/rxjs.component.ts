import { Component, OnDestroy } from '@angular/core';
import { Observable, map, interval, take, filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent implements OnDestroy{
  public intervalSubs: Subscription;

  constructor(){
    // this.retornaObservable().pipe(
    //   retry(2)
    // ).subscribe({
    //   next: (valor) => console.log('Subs: ', valor),
    //   error: (error) => console.log('Error: ', error),
    //   complete: () => console.info('Observador terminado')})

    this.intervalSubs = this.retornaIntervalo().subscribe(console.log);
  } 

  ngOnDestroy(): void {
    this.intervalSubs.unsubscribe();
  }
  
  retornaIntervalo(): Observable<number>{
    return interval(100)
      .pipe(
        //map( valor => `Hola mundo ${valor + 1}`),
        map( valor => valor + 1),
        filter( valor => ((valor % 2) === 0)? true : false),
        //take(10)
      );
  }

  retornaObservable(): Observable<number>{
    let i = -1;
    return new Observable<number>( observer => {
      const intervalo = setInterval( ()=> {
        i++;
        console.log('tick ', i);
        observer.next(i);
        if( i === 2){
          console.log('i == 2 .... error');
          clearInterval(intervalo);
          observer.error('i llegó al valor de 2');
        }
        if(i === 4){
          clearInterval(intervalo);
          observer.complete();
        }

      }, 1000);
    });
  }
}
